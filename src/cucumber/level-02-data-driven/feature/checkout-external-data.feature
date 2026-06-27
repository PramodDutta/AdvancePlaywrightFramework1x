@level2 @external @e2e
Feature: End-to-end checkout, data from an external JSON file (Level 2)

  Background:
    Given I am logged in as a standard user

  Scenario Outline: <persona> completes a full checkout
    When I add product "test-allthethings-tshirt-red" to the cart
    And I check out as the "<persona>" customer
    Then the order should be confirmed

    Examples:
      | persona |
      | alice   |
      | bob     |
      | carol   |
