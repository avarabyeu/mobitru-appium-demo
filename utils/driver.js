import { remote } from 'webdriverio';
import dotenv from 'dotenv';
import { buildCapabilities, getRemoteConfig } from '../config/capabilities.helper.js';
import logger from './logger.js';
import { installAppOnRemoteDevice, shouldInstallApp } from './appInstaller.js';
import { takeDevice, releaseDevice, shouldManageDevice } from './deviceManager.js';

dotenv.config();

let driver = null;

/**
 * Initialize WebDriver instance
 * Supports both local and remote execution
 */
export async function initDriver(customCapabilities = {}) {
  try {
    logger.info('========================================');
    logger.info('Starting WebDriver Initialization');
    logger.info('========================================');

    // Get remote configuration (works for both local and remote)
    logger.debug('Building remote configuration...');
    const config = getRemoteConfig();
    logger.info('Remote config loaded successfully');
    logger.debug('Connection details:', {
      protocol: config.protocol,
      hostname: config.hostname,
      port: config.port,
      path: config.path,
      logLevel: config.logLevel,
      maxInstances: config.maxInstances
    });

    // Build capabilities
    logger.debug('Building capabilities...');
    const capabilities = buildCapabilities(customCapabilities);
    logger.info('Capabilities built successfully');
    logger.debug('Final capabilities:', JSON.stringify(capabilities, null, 2));

    // Set NODE_TLS_REJECT_UNAUTHORIZED if specified
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      logger.warn('⚠️  TLS certificate validation is DISABLED');
    } else {
      logger.info('TLS certificate validation is enabled');
    }

    const isRemote = process.env.EXECUTION_MODE?.toLowerCase() === 'remote';
    const executionMode = isRemote ? 'REMOTE' : 'LOCAL';

    logger.info(`📱 Execution mode: ${executionMode}`);
    logger.info(`🌐 Connecting to: ${config.protocol}://${config.hostname}:${config.port}${config.path}`);

    if (isRemote) {
      logger.info(`🏢 Device Farm: ${config.hostname}`);
      logger.info(`📱 Device UDID: ${capabilities['appium:udid'] || 'Not specified'}`);
      logger.info(`📦 App Package: ${capabilities['appium:appPackage']}`);
      logger.info(`🚀 App Activity: ${capabilities['appium:appActivity']}`);
      logger.debug(`Authorization header present: ${!!config.headers?.Authorization}`);
    }

    // Step 1: Take/acquire device on remote farm (before creating session)
    if (shouldManageDevice()) {
      logger.info('📱 Device acquisition required for remote execution');
      try {
        const deviceStartTime = Date.now();
        await takeDevice();
        const deviceDuration = ((Date.now() - deviceStartTime) / 1000).toFixed(2);
        logger.info(`✅ Device acquired successfully in ${deviceDuration}s`);
      } catch (error) {
        logger.error('❌ Failed to acquire device');
        logger.error(`Error details: ${error.message}`);
        throw error; // Cannot proceed without device
      }
    }

    // Step 2: Install app on remote device (if needed)
    if (shouldInstallApp()) {
      logger.info('📲 App installation required for remote execution');
      try {
        const installStartTime = Date.now();
        await installAppOnRemoteDevice();
        const installDuration = ((Date.now() - installStartTime) / 1000).toFixed(2);
        logger.info(`✅ App installed successfully in ${installDuration}s`);

        // Wait a bit for app installation to complete
        logger.debug('Waiting 3 seconds for app to settle...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        logger.warn('⚠️  App installation failed, but continuing with test execution');
        logger.warn(`Error details: ${error.message}`);
        logger.debug('Full error:', error);
        // Don't throw - app might already be installed
      }
    } else {
      logger.debug('App installation not required (local mode or no app ID specified)');
    }

    // Step 3: Create WebDriver session
    logger.info('Attempting to create WebDriver session...');
    const startTime = Date.now();

    driver = await remote({
      ...config,
      capabilities,
      // Timeout and retry configuration
      waitforTimeout: parseInt(process.env.WAITFOR_TIMEOUT || '10000'),
      connectionRetryTimeout: parseInt(process.env.CONNECTION_RETRY_TIMEOUT || '120000'),
      connectionRetryCount: parseInt(process.env.CONNECTION_RETRY_COUNT || '3'),
      // Enable more verbose logging
      logLevel: process.env.LOG_LEVEL === 'debug' ? 'trace' : (process.env.LOG_LEVEL || 'info'),
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`✅ Driver initialized successfully in ${duration}s`);
    logger.info(`Session ID: ${driver.sessionId}`);

    logger.info('========================================');
    logger.info('WebDriver Initialization Complete');
    logger.info('========================================');

    return driver;
  } catch (error) {
    logger.error('========================================');
    logger.error('❌ DRIVER INITIALIZATION FAILED');
    logger.error('========================================');
    logger.error(`Error type: ${error.name}`);
    logger.error(`Error message: ${error.message}`);

    if (error.response) {
      logger.error('Response status:', error.response.status);
      logger.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }

    if (error.stack) {
      logger.debug('Full stack trace:', error.stack);
    }

    // Log current environment settings for debugging
    logger.error('Current configuration:');
    logger.error(`- EXECUTION_MODE: ${process.env.EXECUTION_MODE}`);
    logger.error(`- DEVICE_FARM_BASE_URL: ${process.env.DEVICE_FARM_BASE_URL}`);
    logger.error(`- DEVICE_FARM_UDID: ${process.env.DEVICE_FARM_UDID}`);
    logger.error(`- DEVICE_FARM_SLUG: ${process.env.DEVICE_FARM_SLUG}`);
    logger.error(`- APP_PACKAGE: ${process.env.APP_PACKAGE}`);
    logger.error(`- APP_ACTIVITY: ${process.env.APP_ACTIVITY}`);
    logger.error(`- NODE_TLS_REJECT_UNAUTHORIZED: ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`);
    logger.error('========================================');

    throw error;
  }
}

/**
 * Get current driver instance
 */
export function getDriver() {
  if (!driver) {
    throw new Error('Driver not initialized. Call initDriver() first.');
  }
  return driver;
}

/**
 * Quit driver and cleanup
 */
export async function quitDriver() {
  if (driver) {
    try {
      logger.info('Quitting driver...');
      await driver.deleteSession();
      driver = null;
      logger.info('Driver quit successfully');
    } catch (error) {
      logger.error('Error quitting driver:', error);
      driver = null;
    }
  }

  // Release device on remote farm
  if (shouldManageDevice()) {
    try {
      await releaseDevice();
    } catch (error) {
      logger.warn('Error releasing device:', error.message);
    }
  }
}

/**
 * Reset driver (quit and reinitialize)
 */
export async function resetDriver(customCapabilities = {}) {
  await quitDriver();
  return await initDriver(customCapabilities);
}

export default {
  initDriver,
  getDriver,
  quitDriver,
  resetDriver
};
