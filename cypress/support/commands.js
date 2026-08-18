Cypress.Commands.add('loginToOdoo', (options = {}) => {
  const database = options.database || Cypress.env('ODOO_DB');
  const username = options.username || Cypress.env('ODOO_USERNAME');
  const password = options.password || Cypress.env('ODOO_PASSWORD');

  if (!username || !password) {
    throw new Error(
      'Set ODOO_USERNAME and ODOO_PASSWORD before running the Odoo login test.',
    );
  }

  cy.visit('/web/login', database ? { qs: { db: database } } : undefined);

  cy.get('input[name="login"]').should('be.visible').clear().type(username);
  cy.get('input[name="password"]')
    .should('be.visible')
    .clear()
    .type(password, { log: false });

  cy.get('body').then(($body) => {
    const databaseInput = $body.find('input[name="db"]');

    if (database && databaseInput.length) {
      cy.wrap(databaseInput).clear().type(database);
    }
  });

  cy.get('form').within(() => {
    cy.get('button[type="submit"], input[type="submit"]').click();
  });
});
