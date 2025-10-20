Feature: EPMXYZ-9099 - Mobitru E-commerce Mobile App - Shopping Flow
  As a user
  I want to complete a full shopping journey
  So that I can purchase items from the mobile app

  Background:
    Given the app is launched

  @epmxyz-9099 @e2e @smoke
  Scenario: Complete shopping flow from login to checkout
    When I login with email "testuser@gmail.com" and password "password1"
    Then I should be successfully logged in

    When I add product "Lenovo Legion Duel Dual-Sim 256GB ROM + 12GB RAM" with price "$620" to cart
    Then the product should be added to cart successfully

    When I open the shopping cart
    Then I should see 1 item in the cart
    And the cart should contain correct product details

    When I proceed to checkout
    Then I should see the checkout form

    When I fill the checkout form with following details:
      | field      | value               |
      | firstName  | John                |
      | lastName   | Doe                 |
      | email      | testuser@gmail.com  |
      | address    | 123 Main Street     |
      | city       | New York            |
      | state      | NY                  |
      | zipCode    | 10001               |

    When I finish the order
    Then the order should be placed successfully
    And the total should be "$631.79"

    When I logout from the app
    Then I should see the login screen

    When I close the application
    Then the app should be terminated successfully
