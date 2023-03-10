import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { AddTaskPage } from "./AddTaskPage";

Given("I am logged in", function () {
  cy.login();
  cy.visit(`${Cypress.env("SITE_NAME")}`);
});

// Adding a new task
When("I submit a new task", function () {
  cy.task("removeAllTasks");

  this.input = "Test input";
  AddTaskPage.inputNewTaskTest(this.input);
  AddTaskPage.clickSubmitTaskBtn();
});

Then("the new task should be persisted", function () {
  AddTaskPage.tasksList().find(`input[value="${this.input}"]`);
});

// Adding a task with a name larger than 1000 characters
Given(
  "I submit a task with a name larger than {int} characters",
  function (int: number) {
    cy.task("removeAllTasks");

    AddTaskPage.inputNewTaskTest("a".repeat(int + 1));
    AddTaskPage.clickSubmitTaskBtn();
  }
);
Then(
  "the persisted task's name is not larger than {int} characters",
  function (int: number) {
    AddTaskPage.tasksList().find(`input[value="${"a".repeat(int)}"]`);
    cy.task("removeAllTasks");
  }
);

// Adding a task with empty characters
Given("I submit a task with no characters", function () {
  cy.task("removeAllTasks");

  AddTaskPage.inputNewTaskTest("a{backspace}");
  AddTaskPage.clickSubmitTaskBtn();
});

Then("the task is not persisted", function () {
  AddTaskPage.tasksList().children().should("have.length", 0);
});
