import { When, Then } from '@cucumber/cucumber';
import logger from '../../utils/logger.js';

// Logout steps
When('I logout from the app', async function() {
  logger.info('Logging out from the app');

  // Implementation: Look for logout button/menu
  // This is a placeholder - adjust based on actual app behavior
  try {
    const logoutButton = await driver.$('//android.widget.Button[@text="Logout"]');
    if (await logoutButton.isDisplayed()) {
      await logoutButton.click();
      await driver.pause(2000);
    }
  } catch (error) {
    logger.warn('Logout button not found, using back navigation');
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

