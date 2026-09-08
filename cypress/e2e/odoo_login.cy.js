describe('Odoo 19 login', () => {
  const database = Cypress.env('ODOO_DB');
  const username = Cypress.env('ODOO_USERNAME');
  const password = Cypress.env('ODOO_PASSWORD');

  it('loads the Odoo login page', () => {
    cy.visitOdooLogin(database);

    cy.get('input[name="login"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('form').within(() => {
      cy.get('button[type="submit"], input[type="submit"]')
        .filter(':visible')
        .first()
        .should('be.enabled');
    });
  });

  it('logs in with configured Odoo credentials', function () {
    if (!username || !password) {
      this.skip();
    }

    cy.loginToOdoo({ database, username, password });

    cy.location('pathname', { timeout: 30000 }).should((pathname) => {
      expect(pathname).to.not.equal('/web/login');
      expect(pathname).to.match(/^\/(web|odoo)(\/.*)?$/);
    });

    cy.get('body').should('not.contain', 'Wrong login/password');
    cy.get('.o_web_client, .o_action_manager', { timeout: 30000 }).should(
      'exist',
    );
  });
});
