import BasePage from './BasePage.js';
import logger from '../../utils/logger.js';

class CheckoutPage extends BasePage {
  constructor() {
    super();

    // Locators
    this.locators = {
      checkoutTitle: '//android.widget.TextView[@text="Checkout"]',
      shippingAddressField: '//android.widget.EditText[@resource-id="shipping_address"]',
      cityField: '//android.widget.EditText[@resource-id="city"]',
      zipCodeField: '//android.widget.EditText[@resource-id="zip_code"]',
      countryField: '//android.widget.EditText[@resource-id="country"]',
      cardNumberField: '//android.widget.EditText[@resource-id="card_number"]',
      expiryDateField: '//android.widget.EditText[@resource-id="expiry_date"]',
      cvvField: '//android.widget.EditText[@resource-id="cvv"]',
      placeOrderButton: '//android.widget.Button[@text="Place Order"]',
      orderSummary: '//android.widget.TextView[@resource-id="order_summary"]',
      successMessage: '//android.widget.TextView[contains(@text, "success") or contains(@text, "Success")]'
    };
  }

  /**
   * Fill shipping address
   * @param {Object} address
   */
  async fillShippingAddress(address) {
    try {
      logger.info('Filling shipping address');

      if (address.street) {
        await this.waitAndSetValue(this.locators.shippingAddressField, address.street);
      }
      if (address.city) {
        await this.waitAndSetValue(this.locators.cityField, address.city);
      }
      if (address.zipCode) {
        await this.waitAndSetValue(this.locators.zipCodeField, address.zipCode);
      }
      if (address.country) {
        await this.waitAndSetValue(this.locators.countryField, address.country);
      }

      logger.info('Shipping address filled');
    } catch (error) {
      logger.error('Failed to fill shipping address', error);
      throw error;
    }
  }

  /**
   * Fill payment information
   * @param {Object} payment
   */
  async fillPaymentInfo(payment) {
    try {
      logger.info('Filling payment information');

      if (payment.cardNumber) {
        await this.waitAndSetValue(this.locators.cardNumberField, payment.cardNumber);
      }
      if (payment.expiryDate) {
        await this.waitAndSetValue(this.locators.expiryDateField, payment.expiryDate);
      }
      if (payment.cvv) {
        await this.waitAndSetValue(this.locators.cvvField, payment.cvv);
      }

      logger.info('Payment information filled');
    } catch (error) {
      logger.error('Failed to fill payment information', error);
      throw error;
    }
  }

  /**
   * Place order
   */
  async placeOrder() {
    try {
      logger.info('Placing order');
      await this.waitAndClick(this.locators.placeOrderButton);
      await driver.pause(3000); // Wait for order processing
      logger.info('Order placed');
    } catch (error) {
      logger.error('Failed to place order', error);
      await this.takeScreenshot('place_order_error');
      throw error;
    }
  }

  /**
   * Complete checkout
   * @param {Object} address
   * @param {Object} payment
   */
  async completeCheckout(address, payment) {
    try {
      logger.info('Completing checkout');
      await this.fillShippingAddress(address);
      await this.fillPaymentInfo(payment);
      await this.placeOrder();
      logger.info('Checkout completed');
    } catch (error) {
      logger.error('Checkout failed', error);
      await this.takeScreenshot('checkout_failed');
      throw error;
    }
  }

  /**
   * Check if order success message is displayed
   * @returns {Promise<boolean>}
   */
  async isOrderSuccessful() {
    return await this.isElementDisplayed(this.locators.successMessage);
  }

  /**
   * Get order summary
   * @returns {Promise<string>}
   */
  async getOrderSummary() {
    return await this.getElementText(this.locators.orderSummary);
  }
}

export default new CheckoutPage();

