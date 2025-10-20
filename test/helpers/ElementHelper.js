import { testConfig } from '../../config/test.config.js';
import logger from '../../utils/logger.js';

class ElementHelper {
  /**
   * Wait for element to be displayed
   * @param {WebdriverIO.Element} element
   * @param {number} timeout
   */
  async waitForDisplayed(element, timeout = testConfig.timeouts.explicit) {
    try {
      await element.waitForDisplayed({ timeout });
      return true;
    } catch (error) {
      logger.error('Element not displayed within timeout', error);
      return false;
    }
  }

  /**
   * Wait for element to be clickable
   * @param {WebdriverIO.Element} element
   * @param {number} timeout
   */
  async waitForClickable(element, timeout = testConfig.timeouts.explicit) {
    try {
      await element.waitForClickable({ timeout });
      return true;
    } catch (error) {
      logger.error(`Element not clickable within ${timeout}ms`, error);
      throw error;
    }
  }

  /**
   * Click element with retry logic
   * @param {WebdriverIO.Element} element
   * @param {number} maxRetries
   */
  async clickWithRetry(element, maxRetries = 3) {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        await this.waitForClickable(element);
        await element.click();
        logger.info('Element clicked successfully');
        return;
      } catch (error) {
        attempts++;
        logger.warn(`Click attempt ${attempts} failed: ${error.message}`);
        if (attempts === maxRetries) {
          logger.error('Failed to click element after retries', error);
          throw error;
        }
        await driver.pause(1000);
      }
    }
  }

  /**
   * Set value with retry logic
   * @param {WebdriverIO.Element} element
   * @param {string} value
   */
  async setValueWithRetry(element, value, maxRetries = 3) {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        await this.waitForDisplayed(element);
        await element.clearValue();
        await element.setValue(value);
        logger.info(`Value set successfully: ${value}`);
        return;
      } catch (error) {
        attempts++;
        logger.warn(`setValue attempt ${attempts} failed: ${error.message}`);
        if (attempts === maxRetries) {
          logger.error('Failed to set value after retries', error);
          throw error;
        }
        await driver.pause(1000);
      }
    }
  }

  /**
   * Get element text
   * @param {WebdriverIO.Element} element
   * @returns {Promise<string>}
   */
  async getText(element) {
    try {
      await this.waitForDisplayed(element);
      const text = await element.getText();
      logger.info(`Element text: ${text}`);
      return text;
    } catch (error) {
      logger.error('Failed to get element text', error);
      throw error;
    }
  }

  /**
   * Check if element is displayed
   * @param {WebdriverIO.Element} element
   * @returns {Promise<boolean>}
   */
  async isDisplayed(element) {
    try {
      return await element.isDisplayed();
    } catch (error) {
      logger.warn('Element is not displayed');
      return false;
    }
  }

  /**
   * Perform tap at coordinates
   * @param {number} x
   * @param {number} y
   */
  async tapAtCoordinates(x, y) {
    try {
      await driver.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerUp', button: 0 }
        ]
      }]);
      await driver.pause(500);
      logger.info(`Tapped at coordinates: (${x}, ${y})`);
    } catch (error) {
      logger.error(`Failed to tap at coordinates (${x}, ${y})`, error);
      throw error;
    }
  }

  /**
   * Scroll to element
   * @param {WebdriverIO.Element} element
   */
  async scrollToElement(element) {
    try {
      await element.scrollIntoView();
      logger.info('Scrolled to element');
    } catch (error) {
      logger.error('Failed to scroll to element', error);
      throw error;
    }
  }

  /**
   * Wait for element to be enabled
   * @param {WebdriverIO.Element} element
   * @param {number} timeout
   */
  async waitForEnabled(element, timeout = 10000) {
    try {
      await element.waitForEnabled({ timeout });
      return true;
    } catch (error) {
      logger.error('Element not enabled within timeout', error);
      return false;
    }
  }

  /**
   * Get element attribute
   * @param {WebdriverIO.Element} element
   * @param {string} attributeName
   * @returns {Promise<string>}
   */
  async getAttribute(element, attributeName) {
    try {
      return await element.getAttribute(attributeName);
    } catch (error) {
      logger.error(`Failed to get attribute: ${attributeName}`, error);
      throw error;
    }
  }
}

export default new ElementHelper();
