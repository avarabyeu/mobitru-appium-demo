import BasePage from './BasePage.js';
import logger from '../../utils/logger.js';

class ProductPage extends BasePage {
  constructor() {
    super();

    // Locators
    this.locators = {
      productTitle: '//android.widget.TextView[@resource-id="product_title"]',
      productPrice: '//android.widget.TextView[@resource-id="product_price"]',
      productImage: '//android.widget.ImageView[@resource-id="product_image"]',
      quantitySelector: '//android.widget.EditText[@resource-id="quantity"]',
      increaseQuantity: '//android.widget.Button[@resource-id="increase_quantity"]',
      decreaseQuantity: '//android.widget.Button[@resource-id="decrease_quantity"]',
      successMessage: '//android.widget.TextView[contains(@text, "Added to cart")]'
    };
  }

  /**
   * Get add to cart button locator for specific product
   * @param {string} productName - Name of the product
   * @returns {string} XPath locator
   */
  getAddToCartButtonLocator(productName) {
    return `//android.widget.TextView[@text='${productName}']/following-sibling::android.widget.Button[contains(@text,'Add to cart')]`;
  }

  /**
   * Add product to cart by product name
   * @param {string} productName - Name of the product to add
   */
  async addToCart(productName) {
    try {
      logger.info(`Adding product to cart: ${productName}`);

      // Try exact match first
      let addToCartLocator = this.getAddToCartButtonLocator(productName);
      let addToCartButton;
      try {
        addToCartButton = await this.waitForElement(addToCartLocator, 8000);
      } catch (e) {
        // Fallback: product title may be truncated. Use first 3 words as anchor.
        const shortKey = productName.split(' ').slice(0, 3).join(' ');
        addToCartLocator = `//android.widget.TextView[contains(@text,'${shortKey}')]/following-sibling::android.widget.Button[contains(@text,'Add to cart')]`;
        addToCartButton = await this.waitForElement(addToCartLocator, 8000);
      }

      await addToCartButton.click();
      await this.driver.pause(1000); // Wait for cart update to start

      // Wait for cart count to update
      await this.waitForCartCountUpdate(1);

      logger.info(`✅ Successfully added ${productName} to cart`);
    } catch (error) {
      logger.error(`Failed to add product to cart: ${productName}`, error);
      throw error;
    }
  }

  /**
   * Wait for cart count to update to expected value
   * @param {number} expectedCount - Expected cart count
   */
  async waitForCartCountUpdate(expectedCount) {
    try {
      logger.info(`Waiting for cart count to update to ${expectedCount}...`);

      await this.driver.waitUntil(
        async () => {
          try {
            const cartElement = await this.driver.$(`//android.widget.TextView[contains(@text, 'Cart')]`);
            const text = await cartElement.getText();
            return text.includes(`(${expectedCount})`);
          } catch (error) {
            return false;
          }
        },
        {
          timeout: 5000,
          timeoutMsg: `❌ Cart count did not update to ${expectedCount} within 5 seconds`
        }
      );

      logger.info(`✅ Cart count updated to ${expectedCount}`);
    } catch (error) {
      logger.error(`Failed to verify cart count update to ${expectedCount}`, error);
      throw error;
    }
  }

  /**
   * Get current cart count from cart badge
   * @returns {Promise<number>}
   */
  async getCartCount() {
    try {
      const cartElement = await this.driver.$(`//android.widget.TextView[contains(@text, 'Cart')]`);
      const text = await cartElement.getText();

      // Extract number from "Cart (X)" format
      const match = text.match(/\((\d+)\)/);
      if (match) {
        const count = parseInt(match[1]);
        logger.info(`Current cart count: ${count}`);
        return count;
      }

      logger.info('No items in cart (badge not found)');
      return 0;
    } catch (error) {
      logger.debug('Cart count element not found, assuming empty cart');
      return 0;
    }
  }

  /**
   * Get product title
   * @returns {Promise<string>}
   */
  async getProductTitle() {
    return await this.getElementText(this.locators.productTitle);
  }

  /**
   * Get product price
   * @returns {Promise<string>}
   */
  async getProductPrice(productName) {
    try {
      const priceLocator = `//android.widget.TextView[@text='${productName}']/following-sibling::android.widget.TextView[contains(@text,'$')]`;
      const priceElement = await this.waitForElement(priceLocator);
      return await priceElement.getText();
    } catch (error) {
      logger.error(`Failed to get price for product: ${productName}`, error);
      throw error;
    }
  }

  /**
   * Set product quantity
   * @param {number} quantity
   */
  async setQuantity(quantity) {
    try {
      logger.info(`Setting quantity to: ${quantity}`);
      await this.waitAndSetValue(this.locators.quantitySelector, quantity.toString());
    } catch (error) {
      logger.error('Failed to set quantity', error);
      throw error;
    }
  }

  /**
   * Increase quantity
   */
  async increaseQuantity() {
    await this.waitAndClick(this.locators.increaseQuantity);
    logger.info('Quantity increased');
  }

  /**
   * Decrease quantity
   */
  async decreaseQuantity() {
    await this.waitAndClick(this.locators.decreaseQuantity);
    logger.info('Quantity decreased');
  }

  /**
   * Check if success message is displayed
   * @returns {Promise<boolean>}
   */
  async isSuccessMessageDisplayed() {
    return await this.isElementDisplayed(this.locators.successMessage);
  }

  /**
   * Check if product is displayed
   * @param {string} productName - Name of the product
   * @returns {Promise<boolean>}
   */
  async isProductDisplayed(productName) {
    try {
      const productLocator = `//android.widget.TextView[@text='${productName}']`;
      return await this.isElementDisplayed(productLocator);
    } catch (error) {
      return false;
    }
  }
}

export default new ProductPage();
