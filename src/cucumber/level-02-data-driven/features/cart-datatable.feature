@level2 @datatable
Feature: Adding products from a Data Table (Level 2)

  Background:
    Given I am logged in as a standard user
    And I am on the products page

  Scenario: Add three products to the cart in one step
    When I add the following products to the cart:
      | productId                    |
      | tta-practice-backpack        |
      | tta-bike-light               |
      | test-allthethings-tshirt-red |
    Then the cart should contain 3 products
