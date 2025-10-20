import { getDriver } from '../../utils/driver.js';
import ElementHelper from '../helpers/ElementHelper.js';
import GestureHelper from '../helpers/GestureHelper.js';
import logger from '../../utils/logger.js';

class BasePage {
  constructor() {
    // Use the singleton instances
    this.elementHelper = ElementHelper;
    this.gestureHelper = GestureHelper;
  }

  /**
   * Get the current driver instance
   */
  get driver() {
    return getDriver();
  }

  /**
   * Find element by locator
   * @param {string} locator
   * @returns {Promise<WebdriverIO.Element>}
   */
  async findElement(locator) {
    try {
      const element = await this.driver.$(locator);
      return element;
    } catch (error) {
      logger.error(`Failed to find element: ${locator}`, error);
      throw error;
    }
  }

  /**
   * Find multiple elements by locator
   * @param {string} locator
   * @returns {Promise<WebdriverIO.Element[]>}
   */
  async findElements(locator) {
    try {
      const elements = await this.driver.$$(locator);
      return elements;
    } catch (error) {
      logger.error(`Failed to find elements: ${locator}`, error);
      throw error;
    }
  }

  /**
   * Wait for page to load
   * @param {number} timeout
   */
  async waitForPageLoad(timeout = 5000) {
    await driver.pause(timeout);
    logger.info('Page loaded');
  }

  /**
   * Take screenshot
   * @param {string} name
   */
  async takeScreenshot(name) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}_${timestamp}.png`;
      await driver.saveScreenshot(`./screenshots/${filename}`);
      logger.info(`Screenshot saved: ${filename}`);
    } catch (error) {
      logger.error('Failed to take screenshot', error);
    }
  }

  /**
   * Hide keyboard
   */
  async hideKeyboard() {
    try {
      if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard();
        logger.info('Keyboard hidden');
      }
    } catch (error) {
      logger.warn('Failed to hide keyboard', error);
    }
  }

  /**
   * Go back
   */
  async goBack() {
    try {
      await driver.back();
      logger.info('Navigated back');
    } catch (error) {
      logger.error('Failed to go back', error);
      throw error;
    }
  }

  /**
   * Get current activity (Android)
   */
  async getCurrentActivity() {
    try {
      const activity = await driver.getCurrentActivity();
      logger.info(`Current activity: ${activity}`);
      return activity;
    } catch (error) {
      logger.error('Failed to get current activity', error);
      throw error;
    }
  }

  /**
   * Wait and click element
   * @param {string} locator
   */
  async waitAndClick(locator) {
    const element = await this.findElement(locator);
    await this.elementHelper.clickWithRetry(element);
  }

  /**
   * Wait and set value
   * @param {string} locator
   * @param {string} value
   */
  async waitAndSetValue(locator, value) {
    const element = await this.findElement(locator);
    await this.elementHelper.setValueWithRetry(element, value);
  }

  /**
   * Get element text
   * @param {string} locator
   * @returns {Promise<string>}
   */
  async getElementText(locator) {
    const element = await this.findElement(locator);
    return await this.elementHelper.getText(element);
  }

  /**
   * Check if element is displayed
   * @param {string} locator
   * @returns {Promise<boolean>}
   */
  async isElementDisplayed(locator) {
    try {
      const element = await this.findElement(locator);
      return await this.elementHelper.isDisplayed(element);
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for element to be displayed
   * @param {string} locator - XPath or other locator strategy
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(locator, timeout = 10000) {
    const element = await this.findElement(locator);
    await element.waitForDisplayed({ timeout });
    return element;
  }

  /**
   * Tap on element
   * @param {string} locator - XPath or other locator strategy
   */
  async tap(locator) {
    const element = await this.waitForElement(locator);
    await element.click();
  }

  /**
   * Enter text into element
   * @param {string} locator - XPath or other locator strategy
   * @param {string} text - Text to enter
   */
  async enterText(locator, text) {
    const element = await this.waitForElement(locator);
    await element.setValue(text);
  }

  /**
   * Get text from element
   * @param {string} locator - XPath or other locator strategy
   */
  async getText(locator) {
    const element = await this.waitForElement(locator);
    return await element.getText();
  }
}

export default BasePage;
