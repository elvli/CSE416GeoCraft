describe('Comment Section', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.visit('https://geocraftmaps.azurewebsites.net/'); // Replace with the actual path to your app
      cy.get('.card.map-card').eq(0).click()
    });
    it('should collapse when the button is clicked', () => {
      });

      it('should check if the comment input is disabled', () => {
        // Check if the comment input is disabled before attempting to type
        cy.get('.form-control').eq(1).should('be.disabled');
      });
  
    it('should type into the comment input', () => {
      const commentText = 'Testing Cypress';
      // // Find the comment input, type text, and check the value
      // cy.get('.form-control').eq(1).type(commentText);    
      // cy.get('.form-control').eq(1).should('have.value', commentText);
    });
  });
  