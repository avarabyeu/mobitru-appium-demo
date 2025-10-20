import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import LoginPage from '../../test/pages/LoginPage.js';
import logger from '../../utils/logger.js';

// Background step
Given('the app is launched', async function() {
  logger.info('App is launched and ready');
  await this.driver.pause(2000); // Wait for app to fully load
});

// Login steps with increased timeout
When('I login with email {string} and password {string}', { timeout: 15000 }, async function(email, password) {
  logger.info(`Logging in with email: ${email}`);
  await LoginPage.login(email, password);
});

Given('I am logged in with email {string} and password {string}', { timeout: 15000 }, async function(email, password) {
  logger.info(`Pre-condition: Logging in with email: ${email}`);
  await LoginPage.login(email, password);

  // Verify login was successful
  const hasError = await LoginPage.isErrorDisplayed();
  expect(hasError).to.be.false;
});

Then('I should be successfully logged in', async function() {
  logger.info('Verifying successful login');
  const hasError = await LoginPage.isErrorDisplayed();
  expect(hasError).to.be.false;
  logger.info('✅ Login: Successfully logged in');
});

Then('no error message should be displayed', async function() {
  const hasError = await LoginPage.isErrorDisplayed();
  expect(hasError).to.be.false;
  logger.info('✅ No error message displayed');
});

Then('I should see an error message', async function() {
  logger.info('Verifying error message is displayed');
  const hasError = await LoginPage.isErrorDisplayed();
  expect(hasError).to.be.true;
  logger.info('✅ Login: Error message displayed as expected');
});

Then('I should remain on the login screen', async function() {
  // Verify we're still on login screen by checking if login fields are visible
  const isLoginScreenVisible = await LoginPage.isLoginScreenDisplayed();
  expect(isLoginScreenVisible).to.be.true;
  logger.info('✅ Still on login screen');
});

Then('I should see the login screen', async function() {
  // Verify login screen is visible
  await this.driver.pause(2000);
  const isLoginScreenVisible = await LoginPage.isLoginScreenDisplayed();
  expect(isLoginScreenVisible).to.be.true;
  logger.info('✅ Login screen is visible');
});
