Feature: Adding a new task
As a user, I want to be able to add new tasks to my Todo account so that I can keep track of my to-do list.

Background:
    Given I am logged in

Scenario: Adding a new task
When I submit a new task
Then the new task should be persisted

Scenario: Adding a task with a name larger than 1000 characters
When I submit a task with a name larger than 1000 characters
Then the persisted task's name is not larger than 1000 characters

Scenario: Adding a task with empty characters
When I submit a task with no characters
Then the task is not persisted
