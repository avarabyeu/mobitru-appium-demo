import BasePage from './BasePage.js';
import logger from '../../utils/logger.js';

class LoginPage extends BasePage {
  constructor() {
    super();

    // Locators
    this.locators = {
      loginLabel: '//android.widget.TextView[@text="Login"]',
      passwordLabel: '//android.widget.TextView[@text="Password"]',
      loginField: '//android.widget.EditText[1]',
      passwordField: '//android.widget.EditText[contains(@password,"true") or @password="true"]',
      signInButton: '//android.widget.Button[@text="Sign in"]',
      errorMessage: '//android.widget.TextView[contains(@text, "Incorrect email or password")]'
    };
  }

  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    try {
      logger.info(`Attempting login with email: ${email}`);

      // Wait for login screen to load
      await this.driver.pause(2000);

      // Enter email
      await this.enterLogin(email);

      // Enter password
      await this.enterPassword(password);

      // Click sign in button
      await this.clickSignIn();

      logger.info('Login action completed');
    } catch (error) {
      logger.error('Login failed', error);
      throw error;
    }
  }

  /**
   * Enter login email
   * @param {string} email
   */
  async enterLogin(email) {
    try {
      logger.info(`Entering login: ${email}`);
      const loginField = await this.waitForElement(this.locators.loginField);
      await loginField.setValue(email);
      await this.driver.pause(500);
    } catch (error) {
      logger.error('Failed to enter login', error);
      throw error;
    }
  }

  /**
   * Enter password
   * @param {string} password
   */
  async enterPassword(password) {
    try {
      logger.info('Entering password');
      const passwordField = await this.waitForElement(this.locators.passwordField);
      await passwordField.setValue(password);
      await this.driver.pause(500);
    } catch (error) {
      logger.error('Failed to enter password', error);
      throw error;
    }
  }

  /**
   * Click sign in button
   */
  async clickSignIn() {
    try {
      logger.info('Clicking Sign In button');
      await this.tap(this.locators.signInButton);
      await this.driver.pause(2000); // Wait for login to process
    } catch (error) {
      logger.error('Failed to click Sign In', error);
      throw error;
    }
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>}
   */
  async isErrorDisplayed() {
    try {
      return await this.isElementDisplayed(this.locators.errorMessage);
    } catch (error) {
      logger.debug('No error message found');
      return false;
    }
  }

  /**
   * Check if login screen is displayed
   * @returns {Promise<boolean>}
   */
  async isLoginScreenDisplayed() {
    try {
      return await this.isElementDisplayed(this.locators.loginLabel);
    } catch (error) {
      return false;
    }
  }
}

export default new LoginPage();
