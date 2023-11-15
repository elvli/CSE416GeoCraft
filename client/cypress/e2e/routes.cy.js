describe('Application Routes', () => {
    it('should navigate to different routes', () => {
      // Visit the root URL
      cy.visit('https://geocraftmaps.azurewebsites.net');

      // Navigate to the sign-up route
      cy.visit('https://geocraftmaps.azurewebsites.net/sign-up');
  
      // Navigate to the login route
      cy.visit('https://geocraftmaps.azurewebsites.net/login');
  
      // Navigate to the password-reset route
      cy.visit('https://geocraftmaps.azurewebsites.net/password-reset');

    });
  });