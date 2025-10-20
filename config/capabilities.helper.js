import dotenv from 'dotenv';

dotenv.config();

/**
 * Helper function to create custom capabilities
 * This allows you to easily override or add capabilities programmatically
 *
 * @param {Object} customCaps - Custom capabilities to merge with defaults
 * @returns {Object} Complete capabilities object
 *
 * @example
 * // Override specific capabilities
 * const caps = buildCapabilities({
 *   'appium:udid': 'CUSTOM_DEVICE_ID',
 *   'appium:appPackage': 'com.custom.app'
 * });
 *
 * @example
 * // Add additional capabilities
 * const caps = buildCapabilities({
 *   'appium:chromedriverExecutable': '/path/to/chromedriver'
 * });
 */
export function buildCapabilities(customCaps = {}) {
  const parseBoolean = (value, defaultValue = false) => {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    return value.toLowerCase() === 'true';
  };

  const isRemoteExecution = () => {
    return process.env.EXECUTION_MODE?.toLowerCase() === 'remote';
  };

  // Base capabilities from environment
  const baseCaps = {
    platformName: process.env.PLATFORM_NAME || 'Android',
    'appium:automationName': process.env.AUTOMATION_NAME || 'UiAutomator2',
    // 'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
    'appium:appPackage': process.env.APP_PACKAGE || 'com.epam.mobitru',
    'appium:appActivity': process.env.APP_ACTIVITY || 'com.epam.mobitru.MainActivity',
    'appium:noReset': parseBoolean(process.env.NO_RESET, true),
    'appium:newCommandTimeout': 30000,
    'appium:autoGrantPermissions': true,
    'appium:autoAcceptAlerts': true,
    'appium:skipUnlock': true,
    'appium:skipDeviceInitialization': false,
    'appium:unicodeKeyboard': true,
    'appium:resetKeyboard': true,
    'mobitru:keepDevice': true,
  };

  // Add UDID based on execution mode
  if (isRemoteExecution()) {
    // Use remote device UDID
    if (process.env.DEVICE_FARM_UDID) {
      baseCaps['appium:udid'] = process.env.DEVICE_FARM_UDID;
    }
  } else {
    // Use local device UDID
    if (process.env.UDID) {
      baseCaps['appium:udid'] = process.env.UDID;
    }
  }

  // Add app path if provided
  if (process.env.APP_PATH) {
    baseCaps['appium:app'] = process.env.APP_PATH;
  }

  // Merge with custom capabilities (custom caps override base)
  const mergedCaps = { ...baseCaps, ...customCaps };

  // Remove undefined values
  Object.keys(mergedCaps).forEach(key => {
    if (mergedCaps[key] === undefined) {
      delete mergedCaps[key];
    }
  });

  return mergedCaps;
}

/**
 * Get remote execution configuration
 * @returns {Object} Remote connection config
 */
export function getRemoteConfig() {
  const isRemote = process.env.EXECUTION_MODE?.toLowerCase() === 'remote';

  if (!isRemote) {
    const localConfig = {
      runner: 'local',
      protocol: 'http',
      hostname: process.env.APPIUM_HOST || '127.0.0.1',
      port: parseInt(process.env.APPIUM_PORT || '4723'),
      path: '/wd/hub',
      logLevel: process.env.LOG_LEVEL || 'info'
    };
    console.log('[Config] Using LOCAL execution configuration');
    return localConfig;
  }

  // Remote execution configuration
  const apiKey = process.env.DEVICE_FARM_API_KEY;
  const slug = process.env.DEVICE_FARM_SLUG;

  console.log('[Config] Using REMOTE execution configuration');
  console.log(`[Config] API Key present: ${!!apiKey} (length: ${apiKey?.length || 0})`);
  console.log(`[Config] Slug: ${slug || 'NOT SET'}`);

  if (!apiKey || !slug) {
    const error = new Error('DEVICE_FARM_API_KEY and DEVICE_FARM_SLUG are required for remote execution');
    console.error('[Config] ❌ Missing required configuration:', {
      hasApiKey: !!apiKey,
      hasSlug: !!slug
    });
    throw error;
  }

  // Create basic auth credentials
  const credentials = `${slug}:${apiKey}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');
  console.log(`[Config] Credentials encoded successfully (length: ${encodedCredentials.length})`);

  const baseUrl = process.env.DEVICE_FARM_BASE_URL;
  console.log(`[Config] Base URL: ${baseUrl}`);

  const remoteConfig = {
    runner: 'local',
    protocol: 'https',
    hostname: baseUrl,
    headers: {
      Authorization: `Basic ${encodedCredentials}`
    },
    path: '/wd/hub',
    logLevel: process.env.LOG_LEVEL || 'debug',
    port: 443,
    maxInstances: parseInt(process.env.MAX_INSTANCES || '1')
  };

  console.log(`[Config] Remote config created: ${remoteConfig.protocol}://${remoteConfig.hostname}:${remoteConfig.port}${remoteConfig.path}`);

  return remoteConfig;
}

/**
 * Predefined capability sets for common scenarios
 */
export const capabilitySets = {
  /**
   * Basic Android app testing
   */
  androidBasic: () => buildCapabilities({}),

  /**
   * Android app with Chrome browser hybrid testing
   */
  androidHybrid: () => buildCapabilities({
    'appium:autoWebview': true,
    'appium:chromedriverAutodownload': true
  }),

  /**
   * Android with full reset (clean install)
   */
  androidFullReset: () => buildCapabilities({
    'appium:noReset': false,
    'appium:fullReset': true
  }),

  /**
   * Android with custom Chrome options
   */
  androidWithChrome: (chromeOptions = {}) => buildCapabilities({
    'appium:chromeOptions': {
      w3c: false,
      ...chromeOptions
    }
  }),

  /**
   * Custom capability set
   * @param {Object} caps - Custom capabilities
   */
  custom: (caps) => buildCapabilities(caps)
};

export default buildCapabilities;
