Feature: Shopping Cart Functionality
  As a user
  I want to manage items in my shopping cart
  So that I can review and modify my purchase

  Background:
    Given the app is launched
    And I am logged in with email "testuser@gmail.com" and password "password1"

  @cart
  Scenario: View cart with added product
    Given I have added product "Samsung Galaxy S20 Ultra 5G 128GB" to cart
    When I open the shopping cart
    Then I should see 1 item(s) in the cart

  @cart
  Scenario: Add multiple products to cart
    Given I have added product "Samsung Galaxy S20 Ultra 5G 128GB" to cart
    And I have added product "iPhone 12 Pro Max 256GB" to cart
    When I open the shopping cart
    Then I should see 2 item(s) in the cart

  @cart
  Scenario: Empty cart check
    When I open the shopping cart
    Then I should see 0 item(s) in the cart
