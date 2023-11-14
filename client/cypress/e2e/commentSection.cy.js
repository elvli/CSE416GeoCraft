describe('Comment Section Collapse', () => {
  it('should collapse when the button is clicked', () => {
    // Visit your app's URL or the specific page containing the sidebar
    cy.visit('https://geocraftmaps.azurewebsites.net/');

    // Ensure that the sidebar is initially not collapsed
    cy.get('#right-wrapper').should('not.have.class', 'toggled');

    // Click the button that triggers the collapse
    cy.get('#right-menu-toggle').click();

    // Wait for a moment to allow for any animation or transition to complete
    cy.wait(1000);

    // Assert that the sidebar is collapsed
    cy.get('#right-wrapper').should('have.class', 'toggled');
    });
  });

  describe('Write a comment', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.visit('https://geocraftmaps.azurewebsites.net/'); // Replace with the actual path to your app
    });
  
    it('should type into the comment input', () => {
      const commentText = 'Testing Cypress';
  
      // Find the comment input and type text
      cy.get('.form-control').eq(1).scrollIntoView().type(commentText).should('have.value', commentText);
    });
  });
  