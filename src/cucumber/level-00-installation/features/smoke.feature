@level0 @smoke
Feature: Cucumber + Playwright wiring (Level 0)

  Scenario: The TTACart login page loads
    Given I open the TTACart login page
    Then the page title should contain "TTACart"
