import logger from '../../utils/logger.js';
import { getDriver } from '../../utils/driver.js';

class GestureHelper {
  /**
   * Swipe from one point to another
   * @param {number} startX
   * @param {number} startY
   * @param {number} endX
   * @param {number} endY
   * @param {number} duration
   */
  async swipe(startX, startY, endX, endY, duration = 1000) {
    try {
      const driver = getDriver();
      await driver.touchAction([
        { action: 'press', x: startX, y: startY },
        { action: 'wait', ms: duration },
        { action: 'moveTo', x: endX, y: endY },
        { action: 'release' }
      ]);
      logger.info(`Swiped from (${startX}, ${startY}) to (${endX}, ${endY})`);
    } catch (error) {
      logger.error('Failed to swipe', error);
      throw error;
    }
  }

  /**
   * Swipe up
   * @param {number} distance
   */
  async swipeUp(distance = 500) {
    try {
      const driver = getDriver();
      const { width, height } = await driver.getWindowSize();
      const startX = width / 2;
      const startY = height * 0.8;
      const endY = startY - distance;
      await this.swipe(startX, startY, startX, endY);
    } catch (error) {
      logger.error('Failed to swipe up', error);
      throw error;
    }
  }

  /**
   * Swipe down
   * @param {number} distance
   */
  async swipeDown(distance = 500) {
    try {
      const driver = getDriver();
      const { width, height } = await driver.getWindowSize();
      const startX = width / 2;
      const startY = height * 0.2;
      const endY = startY + distance;
      await this.swipe(startX, startY, startX, endY);
    } catch (error) {
      logger.error('Failed to swipe down', error);
      throw error;
    }
  }

  /**
   * Swipe left
   * @param {number} distance
   */
  async swipeLeft(distance = 500) {
    try {
      const driver = getDriver();
      const { width, height } = await driver.getWindowSize();
      const startX = width * 0.8;
      const startY = height / 2;
      const endX = startX - distance;
      await this.swipe(startX, startY, endX, startY);
    } catch (error) {
      logger.error('Failed to swipe left', error);
      throw error;
    }
  }

  /**
   * Swipe right
   * @param {number} distance
   */
  async swipeRight(distance = 500) {
    try {
      const driver = getDriver();
      const { width, height } = await driver.getWindowSize();
      const startX = width * 0.2;
      const startY = height / 2;
      const endX = startX + distance;
      await this.swipe(startX, startY, endX, startY);
    } catch (error) {
      logger.error('Failed to swipe right', error);
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
   * Long press on element
   * @param {WebdriverIO.Element} element
   * @param {number} duration
   */
  async longPress(element, duration = 2000) {
    try {
      const location = await element.getLocation();
      const driver = getDriver();
      await driver.touchAction([
        { action: 'press', x: location.x, y: location.y },
        { action: 'wait', ms: duration },
        { action: 'release' }
      ]);
      logger.info(`Long pressed for ${duration}ms`);
    } catch (error) {
      logger.error('Failed to long press', error);
      throw error;
    }
  }
}

export default GestureHelper;
