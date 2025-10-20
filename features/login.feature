Feature: Login Functionality
  As a user
  I want to login to the application
  So that I can access the app features

  Background:
    Given the app is launched

  @login @smoke
  Scenario: Successful login with valid credentials
    When I login with email "testuser@gmail.com" and password "password1"
    Then I should be successfully logged in

  @login @negative
  Scenario: Failed login with invalid email
    When I login with email "invalid@email.com" and password "password1"
    Then I should see an error message
    And I should remain on the login screen

  @login @negative
  Scenario: Failed login with invalid password
    When I login with email "testuser@gmail.com" and password "wrongpassword"
    Then I should see an error message
    And I should remain on the login screen

  @login @negative
  Scenario: Failed login with empty credentials
    When I login with email "" and password ""
    Then I should see an error message
    And I should remain on the login screen
