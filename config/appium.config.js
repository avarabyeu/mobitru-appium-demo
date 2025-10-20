import dotenv from 'dotenv';
import { buildCapabilities, getRemoteConfig } from './capabilities.helper.js';

dotenv.config();

/**
 * Convert string boolean to actual boolean
 */
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
};

/**
 * Determine if we're running in remote mode
 */
const isRemoteExecution = () => {
  return process.env.EXECUTION_MODE?.toLowerCase() === 'remote';
};

/**
 * Encode credentials for Basic Authentication
 */
const getEncodedCredentials = () => {
  const slug = process.env.DEVICE_FARM_SLUG;
  const apiKey = process.env.DEVICE_FARM_API_KEY;

  if (!slug || !apiKey) {
    throw new Error('DEVICE_FARM_SLUG and DEVICE_FARM_API_KEY are required for remote execution');
  }

  const credentials = `${slug}:${apiKey}`;
  return Buffer.from(credentials).toString('base64');
};

/**
 * Appium Configuration
 * Supports both local and remote execution modes
 */

const remoteConfig = getRemoteConfig();

export const config = {
  ...remoteConfig,

  // Capabilities
  capabilities: [{
    ...buildCapabilities()
  }],

  // Test framework settings
  framework: 'mocha',
  mochaOpts: {
    timeout: 300000,
    retries: 2
  },

  // Reporters
  reporters: ['spec'],

  // Services (only for local execution)
  ...(process.env.EXECUTION_MODE?.toLowerCase() !== 'remote' && {
    services: ['appium'],
    appium: {
      command: 'appium',
      args: {
        relaxedSecurity: true,
        allowInsecure: ['chromedriver_autodownload']
      }
    }
  }),

  // Before/After hooks
  before: function() {
    // Set TLS rejection based on env variable
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
  },

  afterTest: async function(test, context, { error }) {
    if (error) {
      // Take screenshot on failure
      const timestamp = new Date().getTime();
      await driver.saveScreenshot(`./screenshots/error-${timestamp}.png`);
    }
  }
};

export default config;
