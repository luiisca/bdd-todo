import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("user on login page", function () {
  cy.log(`Visiting ${Cypress.env("SITE_NAME")}`);
  cy.visit(`${Cypress.env("SITE_NAME")}`);
});

// user successfully logs in
When("user starts the login process", function () {
  // Call your custom cypress command
  cy.login();
  // Visit a route in order to allow cypress to actually set the cookie
  cy.visit(`${Cypress.env("SITE_NAME")}`);
  // Wait until the intercepted request is ready
  cy.wait("@session");
});
Then("they are redirected to the main page", function () {
  cy.get("[data-test-id='authenticated']")
    .should("exist")
    .then(() => {
      cy.log("Cypress login successful");
    });
});
