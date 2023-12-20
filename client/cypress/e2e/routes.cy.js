Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from
  // failing the test when an unhandled exception occurs
  return false;
});

describe('Application Routes', () => {
  
    it('should navigate to different routes', () => {
      // Visit the root URL
      cy.visit('https://geocraftmaps.azurewebsites.net');
    });
    it('should navigate to login', () => {
      cy.visit('https://geocraftmaps.azurewebsites.net/login');
    });

      it('should navigate to sign up', () => {
        cy.visit('https://geocraftmaps.azurewebsites.net/sign-up');
      });
  
      it('should navigate to password reset', () => {
        cy.visit('https://geocraftmaps.azurewebsites.net/password-reset');
      });
    it('should navigate to profile page', () => {
      // Perform login operation
      cy.visit('https://geocraftmaps.azurewebsites.net/login');
          // Input valid login credentials
      cy.get('[name="email"]').type('elvenli54@gmail.com');
      cy.get('[name="password"]').type('123123123');

      // Submit the form
      cy.get('.form-button').click();
      // Navigate to the profile route
      cy.get('#dropdown-basic').click();
      cy.get('.dropdown-btn').click();

    });
    it('should navigate to verify code', () => {
      cy.visit('https://geocraftmaps.azurewebsites.net/verify');

    });

  });