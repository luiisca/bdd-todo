Feature: Removing a task
As a user, I want to be able to remove tasks from my Todo account so that I can keep my to-do list organized.

Background:
Given I am on logged in

Scenario: Removing a task
Given there are tasks in the list
When I select a task from the task list
And I submit the task removal
Then the selected task should be removed from the DB and no longer be visible on the page

Scenario: Removing multiple tasks at once
Given there are multiple tasks in the task list
When I select multiple tasks from the task list
And I submit the task removal
Then the selected tasks should be removed from the DB and no longer be visible on the page

Scenario: Removing all tasks
Given there are tasks in the task list
When I select the option to remove all tasks
And I confirm the task removal
Then all tasks should be removed from the task list and no longer be visible on the page

Scenario: Task removal is undoable
Given there are tasks in the task list
When I submit a task removal
Then the system should give me an option to undo the task removal.
