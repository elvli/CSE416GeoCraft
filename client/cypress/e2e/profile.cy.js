describe('Profile Page', () => {
    beforeEach(() => {
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
      it('should navigate to profile page', () => {
  
      });
      it('should navigate to my maps tab', () => {
        cy.get('button.nav-link.active').click();
  
      });
      it('should navigate to my liked maps tab', () => {
        cy.get('button.nav-link').eq(1).click();
  
      });
})
