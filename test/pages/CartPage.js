import BasePage from './BasePage.js';
import logger from '../../utils/logger.js';

class CartPage extends BasePage {
  constructor() {
    super();

    // Locators
    this.locators = {
      cartIcon: '//android.widget.TextView[contains(@text, "Cart")]',
      cartButton: '//android.widget.Button[@text="Cart"]',
      cartItems: '//android.widget.LinearLayout[@resource-id="cart_item"]',
      cartItemsList: '//androidx.recyclerview.widget.RecyclerView//android.view.ViewGroup',
      itemName: '//android.widget.TextView[@resource-id="product_name"]',
      itemPrice: '//android.widget.TextView[@resource-id="product_price"]',
      itemQuantity: '//android.widget.TextView[@resource-id="product_quantity"]',
      removeButton: '//android.widget.Button[@text="Remove"]',
      totalPrice: '//android.widget.TextView[@resource-id="total_price"]',
      checkoutButton: '//android.widget.Button[@text="Checkout"]',
      emptyCartMessage: '//android.widget.TextView[contains(@text, "empty")]'
    };
  }

  /**
   * Open shopping cart
   */
  async openCart() {
    try {
      logger.info('Opening shopping cart');

      // Try to find and click cart button/icon
      try {
        await this.tap(this.locators.cartIcon);
      } catch (error) {
        // Fallback to cart button if icon not found
        await this.tap(this.locators.cartButton);
      }

      await this.driver.pause(2000); // Wait for cart to load
      logger.info('Cart opened successfully');
    } catch (error) {
      logger.error('Failed to open cart', error);
      throw error;
    }
  }

  /**
   * Get number of items in cart
   * @returns {Promise<number>}
   */
  async getCartItemsCount() {
    try {
      const items = await this.findElements(this.locators.cartItemsList);
      const count = items.length;
      logger.info(`Cart contains ${count} item(s)`);
      return count;
    } catch (error) {
      logger.debug('No items found in cart');
      return 0;
    }
  }

  /**
   * Check if product is in cart by name
   * @param {string} productName - Name of the product
   * @returns {Promise<boolean>}
   */
  async isProductInCart(productName) {
    try {
      const productLocator = `//android.widget.TextView[@text='${productName}']`;
      return await this.isElementDisplayed(productLocator);
    } catch (error) {
      logger.debug(`Product ${productName} not found in cart`);
      return false;
    }
  }

  /**
   * Get all cart items details
   * @returns {Promise<Array>}
   */
  async getCartItems() {
    try {
      const items = await this.findElements(this.locators.cartItemsList);
      const cartItems = [];

      for (const item of items) {
        try {
          const name = await item.$(this.locators.itemName).getText();
          const price = await item.$(this.locators.itemPrice).getText();
          const quantity = await item.$(this.locators.itemQuantity).getText();

          cartItems.push({ name, price, quantity });
        } catch (error) {
          logger.warn('Failed to extract item details', error);
        }
      }

      logger.info(`Retrieved ${cartItems.length} cart items`);
      return cartItems;
    } catch (error) {
      logger.error('Failed to get cart items', error);
      return [];
    }
  }

  /**
   * Remove item from cart by index
   * @param {number} index - Index of item to remove (0-based)
   */
  async removeItemByIndex(index) {
    try {
      logger.info(`Removing item at index ${index}`);
      const items = await this.findElements(this.locators.cartItemsList);

      if (items.length > index) {
        const removeButton = await items[index].$(this.locators.removeButton);
        await removeButton.click();
        await this.driver.pause(1000);
        logger.info('Item removed successfully');
      } else {
        throw new Error(`Item at index ${index} not found`);
      }
    } catch (error) {
      logger.error(`Failed to remove item at index ${index}`, error);
      throw error;
    }
  }

  /**
   * Remove product from cart by name
   * @param {string} productName - Name of the product to remove
   */
  async removeProductByName(productName) {
    try {
      logger.info(`Removing product: ${productName}`);
      const productLocator = `//android.widget.TextView[@text='${productName}']/following-sibling::android.widget.Button[@text='Remove']`;
      await this.tap(productLocator);
      await this.driver.pause(1000);
      logger.info(`Product ${productName} removed successfully`);
    } catch (error) {
      logger.error(`Failed to remove product ${productName}`, error);
      throw error;
    }
  }

  /**
   * Get total price from cart
   * @returns {Promise<string>}
   */
  async getTotalPrice() {
    try {
      return await this.getText(this.locators.totalPrice);
    } catch (error) {
      logger.error('Failed to get total price', error);
      throw error;
    }
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    try {
      logger.info('Proceeding to checkout');
      await this.tap(this.locators.checkoutButton);
      await this.driver.pause(2000);
      logger.info('Navigated to checkout');
    } catch (error) {
      logger.error('Failed to proceed to checkout', error);
      throw error;
    }
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>}
   */
  async isCartEmpty() {
    try {
      const count = await this.getCartItemsCount();
      return count === 0;
    } catch (error) {
      return true;
    }
  }

  /**
   * Verify cart is empty by checking empty message
   * @returns {Promise<boolean>}
   */
  async hasEmptyCartMessage() {
    return await this.isElementDisplayed(this.locators.emptyCartMessage);
  }
}

export default new CartPage();
