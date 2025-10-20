import https from 'https';
import http from 'http';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

/**
 * Install app on remote device farm (Mobitru)
 * This should be called after Appium session is established
 *
 * @returns {Promise<Object>} Installation result
 */
export async function installAppOnRemoteDevice() {
  const isRemote = process.env.EXECUTION_MODE?.toLowerCase() === 'remote';

  if (!isRemote) {
    logger.info('Skipping app installation - not in remote execution mode');
    return { skipped: true };
  }

  const udid = process.env.DEVICE_FARM_UDID;
  const billingUnit = process.env.DEVICE_FARM_SLUG;
  const appId = process.env.DEVICE_FARM_APP_ID;
  const accessKey = process.env.DEVICE_FARM_API_KEY;
  const baseUrl = process.env.DEVICE_FARM_BASE_URL || 'app.mobitru.com';

  logger.info('========================================');
  logger.info('Starting App Installation on Remote Device');
  logger.info('========================================');
  logger.debug('App installation configuration:', {
    hasUdid: !!udid,
    hasBillingUnit: !!billingUnit,
    hasAppId: !!appId,
    hasAccessKey: !!accessKey,
    baseUrl: baseUrl,
    udidValue: udid,
    billingUnitValue: billingUnit,
    appIdValue: appId
  });

  if (!udid || !billingUnit || !appId || !accessKey) {
    const missingParams = [];
    if (!udid) missingParams.push('DEVICE_FARM_UDID');
    if (!billingUnit) missingParams.push('DEVICE_FARM_SLUG');
    if (!appId) missingParams.push('DEVICE_FARM_APP_ID');
    if (!accessKey) missingParams.push('DEVICE_FARM_API_KEY');

    const errorMsg = `Missing required configuration for app installation: ${missingParams.join(', ')}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const url = `https://${baseUrl}/billing/unit/${billingUnit}/automation/api/storage/install/${udid}/${appId}`;

  logger.info('📲 Installing app on remote device...');
  logger.info(`URL: ${url}`);
  logger.info(`Device UDID: ${udid}`);
  logger.info(`Billing Unit: ${billingUnit}`);
  logger.info(`App ID: ${appId}`);
  logger.debug(`Access Key length: ${accessKey.length}`);

  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessKey}`,
        'Content-Type': 'application/json'
      },
      // Disable TLS verification if configured
      rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'
    };

    logger.debug('Request options:', {
      method: options.method,
      hasAuthHeader: !!options.headers.Authorization,
      rejectUnauthorized: options.rejectUnauthorized
    });

    const protocol = baseUrl.startsWith('localhost') ? http : https;
    logger.debug(`Using ${protocol === https ? 'HTTPS' : 'HTTP'} protocol`);

    const requestStartTime = Date.now();

    const req = protocol.request(url, options, (res) => {
      const statusCode = res.statusCode;
      logger.info(`Response status code: ${statusCode}`);
      logger.debug('Response headers:', res.headers);

      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
        logger.debug(`Received ${chunk.length} bytes of data`);
      });

      res.on('end', () => {
        const duration = ((Date.now() - requestStartTime) / 1000).toFixed(2);
        logger.info(`Request completed in ${duration}s`);
        logger.debug(`Response body: ${data}`);

        if (res.statusCode >= 200 && res.statusCode < 300) {
          logger.info('✅ App installed successfully on remote device');
          try {
            const jsonData = data ? JSON.parse(data) : {};
            logger.debug('Parsed response:', jsonData);
            resolve({ success: true, statusCode: res.statusCode, data: jsonData });
          } catch (e) {
            logger.debug('Response is not JSON, returning as string');
            resolve({ success: true, statusCode: res.statusCode, data: data });
          }
        } else {
          const errorMsg = `Failed to install app. Status: ${res.statusCode}, Response: ${data}`;
          logger.error(errorMsg);
          logger.error('Full response details:', {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: data
          });
          reject(new Error(errorMsg));
        }
      });
    });

    req.on('error', (error) => {
      logger.error('❌ Request error during app installation');
      logger.error('Error type:', error.name);
      logger.error('Error message:', error.message);
      logger.error('Error code:', error.code);
      if (error.stack) {
        logger.debug('Error stack:', error.stack);
      }
      reject(error);
    });

    req.setTimeout(60000, () => {
      logger.error('❌ App installation timeout after 60 seconds');
      req.destroy();
      reject(new Error('App installation timeout after 60 seconds'));
    });

    logger.debug('Sending request...');
    req.end();
  });
}

/**
 * Check if app installation is required for current execution mode
 * @returns {boolean}
 */
export function shouldInstallApp() {
  const isRemote = process.env.EXECUTION_MODE?.toLowerCase() === 'remote';
  const hasAppId = !!process.env.DEVICE_FARM_APP_ID;
  return isRemote && hasAppId;
}

export default {
  installAppOnRemoteDevice,
  shouldInstallApp
};
