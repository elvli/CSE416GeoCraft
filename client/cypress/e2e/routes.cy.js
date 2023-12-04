Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from
  // failing the test when an unhandled exception occurs
  return false;
});

describe('Application Routes', () => {
  beforeEach(() => {
    // Perform login operation
    cy.visit('https://geocraftmaps.azurewebsites.net/login');
  });
    it('should navigate to different routes', () => {
      // Visit the root URL
      cy.visit('https://geocraftmaps.azurewebsites.net');
    });

      it('should navigate to sign up', () => {
        // Navigate to the profile route
        cy.get('a[href=\'/sign-up\']').click(); 
      });
  
      it('should navigate to password reset', () => {
        // Navigate to the profile route
        cy.get('a[href=\'/password-reset\']').click();  
      });
    it('should navigate to profile page', () => {
          // Input valid login credentials
      cy.get('[name="email"]').type('elvenli54@gmail.com');
      cy.get('[name="password"]').type('123123123');

      // Submit the form
      cy.get('.form-button').click();
      // Navigate to the profile route
      // cy.get('#dropdown-basic').click();
      // cy.get('.dropdown-btn').click();

    });
  });