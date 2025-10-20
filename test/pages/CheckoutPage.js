import BasePage from './BasePage.js';
import logger from '../../utils/logger.js';

class CheckoutPage extends BasePage {
  constructor() {
    super();

    // Locators
    this.locators = {
      checkoutTitle: '//android.widget.TextView[@text="Checkout"]',
      // Personal info fields (optional depending on screen layout)
      firstNameField: '//android.widget.EditText[@resource-id="first_name"]',
      lastNameField: '//android.widget.EditText[@resource-id="last_name"]',
      emailField: '//android.widget.EditText[@resource-id="email"]',
      // Shipping fields
      shippingAddressField: '//android.widget.EditText[@resource-id="shipping_address"]',
      cityField: '//android.widget.EditText[@resource-id="city"]',
      stateField: '//android.widget.EditText[@resource-id="state"]',
      zipCodeField: '//android.widget.EditText[@resource-id="zip_code"]',
      countryField: '//android.widget.EditText[@resource-id="country"]',
      // Payment fields (may be skipped for demo app)
      cardNumberField: '//android.widget.EditText[@resource-id="card_number"]',
      expiryDateField: '//android.widget.EditText[@resource-id="expiry_date"]',
      cvvField: '//android.widget.EditText[@resource-id="cvv"]',
      // Actions & summaries
      placeOrderButton: '//android.widget.Button[@text="Place Order"]',
      orderSummary: '//android.widget.TextView[@resource-id="order_summary"]',
      successMessage: '//android.widget.TextView[contains(@text, "success") or contains(@text, "Success")]',
      // Possible total locators (fallbacks)
      totalPriceGeneric: "//android.widget.TextView[contains(@text, '$')]",
      totalPriceById: "//android.widget.TextView[@resource-id='total_price']",
      totalAfterLabel: "//android.widget.TextView[contains(translate(., 'TOTAL','total'),'total')]/following::android.widget.TextView[contains(@text,'$')][1]"
    };
  }

  /**
   * Fill personal information (if fields are present)
   * @param {{firstName?: string, lastName?: string, email?: string}} person
   */
  async fillPersonalInfo(person) {
    try {
      logger.info('Filling personal information');

      if (person.firstName) {
        try { await this.waitAndSetValue(this.locators.firstNameField, person.firstName); } catch (e) { logger.debug('First name field not found, skipping'); }
      }
      if (person.lastName) {
        try { await this.waitAndSetValue(this.locators.lastNameField, person.lastName); } catch (e) { logger.debug('Last name field not found, skipping'); }
      }
      if (person.email) {
        try { await this.waitAndSetValue(this.locators.emailField, person.email); } catch (e) { logger.debug('Email field not found, skipping'); }
      }

      logger.info('Personal information filled (where available)');
    } catch (error) {
      logger.error('Failed to fill personal information', error);
      throw error;
    }
  }

  /**
   * Fill shipping address
   * @param {{street?: string, city?: string, state?: string, zipCode?: string, country?: string}} address
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
      if (address.state) {
        try { await this.waitAndSetValue(this.locators.stateField, address.state); } catch (e) { logger.debug('State field not found, attempting country field as fallback'); if (address.state) { try { await this.waitAndSetValue(this.locators.countryField, address.state); } catch (e2) { logger.debug('Country field also not found, skipping state'); } } }
      }
      if (address.zipCode) {
        await this.waitAndSetValue(this.locators.zipCodeField, address.zipCode);
      }
      if (address.country) {
        try { await this.waitAndSetValue(this.locators.countryField, address.country); } catch (e) { logger.debug('Country field not found, skipping'); }
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

  /**
   * Get total amount shown on screen after checkout/review
   * Tries several strategies to find a value with a dollar sign.
   * @returns {Promise<string|null>}
   */
  async getTotalAmount() {
    try {
      // Try by explicit id first
      if (await this.isElementDisplayed(this.locators.totalPriceById)) {
        return await this.getElementText(this.locators.totalPriceById);
      }

      // Try relative to Total label
      if (await this.isElementDisplayed(this.locators.totalAfterLabel)) {
        return await this.getElementText(this.locators.totalAfterLabel);
      }

      // Fallback to last text with $ on the screen
      const matches = await this.findElements(this.locators.totalPriceGeneric);
      if (matches.length > 0) {
        const last = matches[matches.length - 1];
        return await this.elementHelper.getText(last);
      }
    } catch (error) {
      logger.debug('getTotalAmount fallback failed', error);
    }
    return null;
  }
}

export default new CheckoutPage();

