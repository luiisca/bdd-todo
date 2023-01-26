/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
//

// take a look at for a diferent approach withouth much mocking and db:seeding too:
// https://github.com/pixelass/pwa-template/blob/f6820f6b96f6a37d2edf3a54f5760d53f4b96508/cypress/support/commands.ts
// https://github.com/yeungalan0/site-monorepo/blob/000f874a675374512dc46404e9d6958c41a53ba7/my_site/cypress/integration/life-in-weeks/general.spec.ts
// original discussion: https://github.com/nextauthjs/next-auth/discussions/2053
Cypress.Commands.add("login", () => {
  cy.session("login", () => {
    cy.visit(`${Cypress.env("SITE_NAME")}/login`);
    cy.intercept(`${Cypress.env("SITE_NAME")}/api/auth/session`, {
      fixture: "session.json",
    }).as("session");

    // Set the cookie for cypress.
    // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
    // This step can probably/hopefully be improved.
    // We are currently unsure about this part.
    // We need to refresh this cookie once in a while.
    // We are unsure if this is true and if true, when it needs to be refreshed.
    cy.setCookie(
      "next-auth.session-token",
      "aff2b5f7-809e-40ad-93cb-ca423a008ed9"
    );

    // Visit a route in order to allow cypress to actually set the cookie
    cy.visit(`${Cypress.env("SITE_NAME")}`);
    // Wait until the intercepted request is ready
    cy.wait("@session");
    cy.get("[data-test-id='authenticated']")
      .should("exist")
      .then(() => {
        cy.log("Cypress login successful");
      });
    cy.visit("http://localhost:3000");
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable;
    }
  }
}
export {};
