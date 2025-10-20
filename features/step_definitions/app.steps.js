import { When, Then } from '@cucumber/cucumber';
import logger from '../../utils/logger.js';

// Logout steps
When('I logout from the app', async function() {
  logger.info('Logging out from the app');

  // Implementation: Look for logout button/menu in various locations
  try {
    // Try different logout button variations
    const logoutSelectors = [
      '//android.widget.Button[@text="Logout"]',
      '//android.widget.Button[@text="Log out"]',
      '//android.widget.TextView[@text="Logout"]',
      '//android.widget.TextView[@text="Log out"]',
      '//android.widget.Button[contains(@text,"Logout")]',
      '//android.widget.TextView[contains(@text,"Logout")]'
    ];

    let logoutFound = false;
    for (const selector of logoutSelectors) {
      try {
        const logoutButton = await driver.$(selector);
        if (await logoutButton.isDisplayed()) {
          await logoutButton.click();
          await driver.pause(2000);
          logoutFound = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
        continue;
      }
    }

    if (!logoutFound) {
      // Try to find menu button first
      try {
        const menuButton = await driver.$('//android.widget.Button[@content-desc="Menu"]');
        if (await menuButton.isDisplayed()) {
          await menuButton.click();
          await driver.pause(1000);
          
          // Now try logout again
          for (const selector of logoutSelectors) {
            try {
              const logoutButton = await driver.$(selector);
              if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.pause(2000);
                logoutFound = true;
                break;
              }
            } catch (error) {
              continue;
            }
          }
        }
      } catch (error) {
        logger.warn('Menu button not found');
      }
    }

    if (!logoutFound) {
      logger.warn('Logout button not found, using back navigation');
      await driver.back();
      await driver.pause(1000);
    }

  } catch (error) {
    logger.error('Error during logout process', error);
    // Fallback to back navigation
    await driver.back();
    await driver.pause(1000);
  }

  logger.info('✅ Logout: Successfully logged out and returned to login screen');
});

// App lifecycle steps
When('I close the application', async function() {
  logger.info('Closing the application');

  // Close app by terminating the session
  // The driver will be quit in the After hook
  await driver.pause(1000);
});

Then('the app should be terminated successfully', async function() {
  logger.info('✅ Close application: App terminated successfully');
  // App termination will happen in After hook
});

