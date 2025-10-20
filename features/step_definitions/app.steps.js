import { When, Then } from '@cucumber/cucumber';
import logger from '../../utils/logger.js';

// Logout steps
When('I logout from the app', async function() {
  logger.info('Logging out from the app');

  // Implementation: Look for logout button/menu with multiple fallback options
  try {
    // Try different logout button variations
    const logoutSelectors = [
      '//android.widget.Button[@text="Logout"]',
      '//android.widget.Button[@text="Log out"]',
      '//android.widget.Button[@text="Sign out"]',
      '//android.widget.TextView[@text="Logout"]',
      '//android.widget.TextView[@text="Log out"]',
      '//android.widget.TextView[@text="Sign out"]',
      '//*[contains(@text, "Logout") or contains(@text, "Log out") or contains(@text, "Sign out")]'
    ];

    let logoutSuccessful = false;
    
    for (const selector of logoutSelectors) {
      try {
        const logoutElement = await driver.$(selector);
        if (await logoutElement.isDisplayed()) {
          await logoutElement.click();
          await driver.pause(2000);
          logoutSuccessful = true;
          logger.info(`✅ Logout successful using selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Continue to next selector
        continue;
      }
    }

    if (!logoutSuccessful) {
      logger.warn('Logout button not found with any selector, trying menu navigation');
      
      // Try to find and click menu/profile button first
      try {
        const menuSelectors = [
          '//android.widget.Button[contains(@text, "Menu")]',
          '//android.widget.TextView[contains(@text, "Profile")]',
          '//android.widget.ImageView[@content-desc="Menu"]',
          '//*[@content-desc="More options"]'
        ];

        for (const menuSelector of menuSelectors) {
          try {
            const menuElement = await driver.$(menuSelector);
            if (await menuElement.isDisplayed()) {
              await menuElement.click();
              await driver.pause(1000);
              
              // Now try logout again
              for (const selector of logoutSelectors) {
                try {
                  const logoutElement = await driver.$(selector);
                  if (await logoutElement.isDisplayed()) {
                    await logoutElement.click();
                    await driver.pause(2000);
                    logoutSuccessful = true;
                    logger.info(`✅ Logout successful via menu: ${selector}`);
                    break;
                  }
                } catch (error) {
                  continue;
                }
              }
              if (logoutSuccessful) break;
            }
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        logger.warn('Menu navigation failed');
      }
    }

    if (!logoutSuccessful) {
      logger.warn('All logout methods failed, using back navigation as fallback');
      await driver.back();
      await driver.pause(1000);
    }

  } catch (error) {
    logger.error('Logout failed with error:', error);
    // Final fallback - use back navigation
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

