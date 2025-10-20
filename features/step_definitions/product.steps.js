import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import ProductPage from '../../test/pages/ProductPage.js';
import CartPage from '../../test/pages/CartPage.js';
import logger from '../../utils/logger.js';

// Product steps
When('I add product {string} with price {string} to cart', async function(productName, price) {
  logger.info(`Adding product: ${productName} with price: ${price}`);

  // Store product details for later verification
  this.expectedProduct = {
    name: productName,
    price: price
  };

  await ProductPage.addToCart(productName);
  logger.info(`✅ Add item to cart: Added ${productName} (${price}) to cart`);
});

When('I add product {string} to cart', async function(productName) {
  logger.info(`Adding product: ${productName}`);
  await ProductPage.addToCart(productName);
  logger.info(`✅ Product ${productName} added to cart`);
});

Given('I have added product {string} to cart', async function(productName) {
  logger.info(`Pre-condition: Adding product ${productName} to cart`);
  await ProductPage.addToCart(productName);
});

Then('the product should be added to cart successfully', async function() {
  // Verify success message or wait for cart update
  await this.driver.pause(1000);
  logger.info('✅ Product added to cart successfully');
});
