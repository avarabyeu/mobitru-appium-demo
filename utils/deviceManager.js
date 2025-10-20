import https from 'https';
import http from 'http';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

/**
 * Take/acquire device on remote device farm (Mobitru)
 * This should be called before establishing Appium session
 *
 * @returns {Promise<Object>} Device acquisition result
 */
export async function takeDevice() {
  const isRemote = process.env.EXECUTION_MODE?.toLowerCase() === 'remote';

  if (!isRemote) {
    logger.info('Skipping device acquisition - not in remote execution mode');
    return { skipped: true };
  }

  const udid = process.env.DEVICE_FARM_UDID;
  const billingUnit = process.env.DEVICE_FARM_SLUG;
  const accessKey = process.env.DEVICE_FARM_API_KEY;
  const baseUrl = process.env.DEVICE_FARM_BASE_URL || 'app.mobitru.com';

  logger.info('========================================');
  logger.info('Taking Device on Remote Farm');
  logger.info('========================================');
  logger.debug('Device acquisition configuration:', {
    hasUdid: !!udid,
    hasBillingUnit: !!billingUnit,
    hasAccessKey: !!accessKey,
    baseUrl: baseUrl,
    udidValue: udid,
    billingUnitValue: billingUnit
  });

  if (!udid || !billingUnit || !accessKey) {
    const missingParams = [];
    if (!udid) missingParams.push('DEVICE_FARM_UDID');
    if (!billingUnit) missingParams.push('DEVICE_FARM_SLUG');
    if (!accessKey) missingParams.push('DEVICE_FARM_API_KEY');

    const errorMsg = `Missing required configuration for device acquisition: ${missingParams.join(', ')}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const url = `https://${baseUrl}/billing/unit/${billingUnit}/automation/api/device/${udid}`;

  logger.info('📱 Taking device on remote farm...');
  logger.info(`URL: ${url}`);
  logger.info(`Device UDID: ${udid}`);
  logger.info(`Billing Unit: ${billingUnit}`);
  logger.debug(`Access Key length: ${accessKey.length}`);

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
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
          logger.info('✅ Device acquired successfully on remote farm');
          try {
            const jsonData = data ? JSON.parse(data) : {};
            logger.debug('Parsed response:', jsonData);
            resolve({ success: true, statusCode: res.statusCode, data: jsonData });
          } catch (e) {
            logger.debug('Response is not JSON, returning as string');
            resolve({ success: true, statusCode: res.statusCode, data: data });
          }
        } else {
          const errorMsg = `Failed to take device. Status: ${res.statusCode}, Response: ${data}`;
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
      logger.error('❌ Request error during device acquisition');
      logger.error('Error type:', error.name);
      logger.error('Error message:', error.message);
      logger.error('Error code:', error.code);
      if (error.stack) {
        logger.debug('Error stack:', error.stack);
      }
      reject(error);
    });

    req.setTimeout(60000, () => {
      logger.error('❌ Device acquisition timeout after 60 seconds');
      req.destroy();
      reject(new Error('Device acquisition timeout after 60 seconds'));
    });

    logger.debug('Sending request...');
    req.end();
  });
}

/**
 * Release device on remote device farm (Mobitru)
 * This should be called after tests complete
 *
 * @returns {Promise<Object>} Device release result
 */
export async function releaseDevice() {
  const isRemote = process.env.EXECUTION_MODE?.toLowerCase() === 'remote';

  if (!isRemote) {
    logger.info('Skipping device release - not in remote execution mode');
    return { skipped: true };
  }

  const udid = process.env.DEVICE_FARM_UDID;
  const billingUnit = process.env.DEVICE_FARM_SLUG;
  const accessKey = process.env.DEVICE_FARM_API_KEY;
  const baseUrl = process.env.DEVICE_FARM_BASE_URL || 'app.mobitru.com';

  logger.info('Releasing device on remote farm...');

  if (!udid || !billingUnit || !accessKey) {
    logger.warn('Cannot release device - missing configuration');
    return { skipped: true };
  }

  const url = `https://${baseUrl}/billing/unit/${billingUnit}/automation/api/device/${udid}`;

  return new Promise((resolve, reject) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessKey}`,
        'Content-Type': 'application/json'
      },
      rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'
    };

    const protocol = baseUrl.startsWith('localhost') ? http : https;

    const req = protocol.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          logger.info('✅ Device released successfully');
          resolve({ success: true, statusCode: res.statusCode });
        } else {
          logger.warn(`⚠️  Failed to release device. Status: ${res.statusCode}`);
          resolve({ success: false, statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      logger.warn('⚠️  Error releasing device:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(30000, () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

/**
 * Check if device management is required for current execution mode
 * @returns {boolean}
 */
export function shouldManageDevice() {
  const isRemote = process.env.EXECUTION_MODE?.toLowerCase() === 'remote';
  return isRemote;
}

export default {
  takeDevice,
  releaseDevice,
  shouldManageDevice
};

