Feature: Login

Background:
    Given user on login page

Scenario: user successfully logs in
    When user starts the login process
    Then they are redirected to the main page
