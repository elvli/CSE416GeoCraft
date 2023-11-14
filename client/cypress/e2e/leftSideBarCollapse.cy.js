describe('LeftSideBar Component Collapse', () => {
  it('should collapse when the button is clicked', () => {
    // Visit your app's URL or the specific page containing the sidebar
    cy.visit('https://geocraftmaps.azurewebsites.net/');

    // Ensure that the sidebar is initially not collapsed
    cy.get('#left-wrapper').should('not.have.class', 'toggled');

    // Click the button that triggers the collapse
    cy.get('#left-menu-toggle').click();

    // Wait for a moment to allow for any animation or transition to complete
    cy.wait(1000);

    // Assert that the sidebar is collapsed
    cy.get('#left-wrapper').should('have.class', 'toggled');
  });
});
