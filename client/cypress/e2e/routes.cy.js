Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from
  // failing the test when an unhandled exception occurs
  return false;
});


describe('Application Routes', () => {
    it('should navigate to different routes', () => {
      cy.viewport(1200, 800);
      // Visit the root URL
      cy.visit('https://geocraftmaps.azurewebsites.net');

      // Navigate to the sign-up route
      cy.visit('https://geocraftmaps.azurewebsites.net/Sign-up');
  
      // Navigate to the login route
      cy.visit('https://geocraftmaps.azurewebsites.net/login');
  
      // Navigate to the password-reset route
      cy.visit('https://geocraftmaps.azurewebsites.net/password-reset');

      // Navigate to the password-reset route
      cy.visit('https://geocraftmaps.azurewebsites.net/profile');

    });
  });