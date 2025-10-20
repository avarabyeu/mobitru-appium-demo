import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { initDriver, quitDriver } from '../../utils/driver.js';
import logger from '../../utils/logger.js';
import fs from 'fs';
import path from 'path';

// Global driver instance
let driver = null;

/**
 * Before all scenarios
 */
BeforeAll(async function() {
  logger.info('========================================');
  logger.info('Starting test execution');
  logger.info(`Execution mode: ${process.env.EXECUTION_MODE || 'local'}`);
  logger.info('========================================');

  // Ensure screenshots directory exists
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
});

/**
 * Before each scenario
 * Set timeout to 120 seconds to allow for remote driver initialization
 */
Before({ timeout: 120000 }, async function(scenario) {
  logger.info(`Starting scenario: ${scenario.pickle.name}`);

  try {
    // Initialize driver if not already initialized
    if (!driver) {
      logger.info('Initializing driver for the first time...');
      driver = await initDriver();
      // Attach driver to world context
      this.driver = driver;
    } else {
      logger.debug('Reusing existing driver instance');
      this.driver = driver;
    }
  } catch (error) {
    logger.error(`Failed to initialize driver for scenario: ${scenario.pickle.name}`, error);
    throw error;
  }
});

/**
 * After each scenario
 */
After(async function(scenario) {
  const scenarioName = scenario.pickle.name;
  const status = scenario.result.status;

  logger.info(`Scenario "${scenarioName}" finished with status: ${status}`);

  // Take screenshot on failure
  if (status === Status.FAILED && driver) {
    try {
      const timestamp = new Date().getTime();
      const screenshotName = `${scenarioName.replace(/\s+/g, '_')}_${timestamp}.png`;
      const screenshotPath = path.join(process.cwd(), 'screenshots', screenshotName);

      const screenshot = await driver.saveScreenshot(screenshotPath);
      logger.info(`Screenshot saved: ${screenshotPath}`);

      // Attach screenshot to Cucumber report
      this.attach(screenshot, 'image/png');
    } catch (error) {
      logger.error('Failed to take screenshot:', error);
    }
  }

  // Reset app after each scenario to ensure clean state
  if (driver) {
    try {
      logger.info('Resetting app to ensure clean state for next scenario...');

      // Terminate and relaunch the app
      await driver.terminateApp('com.epam.mobitru');
      await driver.pause(1000);
      await driver.activateApp('com.epam.mobitru');
      await driver.pause(2000); // Wait for app to launch

      logger.info('✅ App reset successfully');
    } catch (error) {
      logger.warn('Failed to reset app, app might not be installed:', error.message);
    }
  }
});

/**
 * After all scenarios
 */
AfterAll(async function() {
  logger.info('========================================');
  logger.info('Test execution completed');
  logger.info('========================================');

  // Quit driver
  if (driver) {
    await quitDriver();
    driver = null;
  }
});
