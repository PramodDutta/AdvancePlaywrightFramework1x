@level2 @outline
Feature: TTACart login outcomes (Level 2 — Scenario Outline)

  Background:
    Given I am on the TTACart login page

  Scenario Outline: <username> logging in ends on the <outcome>
    When I log in as "<username>" with password "<password>"
    Then I should see the "<outcome>"

    Examples: valid users
      | username                | password   | outcome  |
      | standard_user           | tta_secret | products |
      | problem_user            | tta_secret | products |
      | performance_glitch_user | tta_secret | products |

    Examples: rejected attempts
      | username        | password       | outcome |
      | locked_out_user | tta_secret     | error   |
      | standard_user   | wrong_password | error   |
