// cypress/integration/AddTask/AddTaskPage.ts

class POM {
  constructor() {}

  tasksList() {
    return cy.get("#tasks-list-test");
  }
  inputNewTaskTest(text: string) {
    return cy.get("#input-test").type(text);
  }
  clickSubmitTaskBtn() {
    return cy.get("#submit-bttn-test").click();
  }
}

export const AddTaskPage = new POM();
