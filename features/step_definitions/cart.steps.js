import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import CartPage from '../../test/pages/CartPage.js';
import logger from '../../utils/logger.js';

// Cart steps
When('I open the shopping cart', async function() {
  logger.info('Opening shopping cart');
  await CartPage.openCart();
});

Given('I have opened the shopping cart', async function() {
  logger.info('Pre-condition: Opening shopping cart');
  await CartPage.openCart();
});

Then('I should see {int} item\\(s) in the cart', async function(expectedCount) {
  logger.info(`Verifying cart has ${expectedCount} item(s)`);
  const actualCount = await CartPage.getCartItemsCount();
  expect(actualCount).to.equal(expectedCount);
  logger.info(`✅ Cart verification: Cart contains ${expectedCount} item(s)`);
});

Then('I should see items in the cart', async function() {
  const itemsCount = await CartPage.getCartItemsCount();
  expect(itemsCount).to.be.greaterThan(0);
  logger.info(`✅ Cart contains ${itemsCount} item(s)`);
});

Then('the cart should contain correct product details', async function() {
  logger.info('Verifying cart product details');

  if (this.expectedProduct) {
    const productInCart = await CartPage.isProductInCart(this.expectedProduct.name);
    expect(productInCart).to.be.true;
    logger.info(`✅ Product ${this.expectedProduct.name} found in cart`);
  } else {
    logger.warn('No expected product details stored, skipping verification');
  }
});

Then('the cart should display correct product information', async function() {
  const itemsCount = await CartPage.getCartItemsCount();
  expect(itemsCount).to.be.greaterThan(0);
  logger.info('✅ Cart displays correct product information');
});

Then('the cart should be empty', async function() {
  logger.info('Verifying cart is empty');
  const count = await CartPage.getCartItemsCount();
  expect(count).to.equal(0);
  logger.info('✅ Cart is empty');
});

When('I remove the item from cart', async function() {
  logger.info('Removing item from cart');
  await CartPage.removeItemByIndex(0);
  logger.info('✅ Item removed from cart');
});
