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

describe('Write a search', () => {
  beforeEach(() => {
    cy.visit('https://geocraftmaps.azurewebsites.net/'); // Replace with the actual path to your app
  });

  it('should type into the comment input', () => {
    const commentText = 'Testing Cypress';

    // Find the comment input and type text
    cy.get('.form-control').eq(0).scrollIntoView().type(commentText).should('have.value', commentText);
  });
});

describe('Create Modal', () => {
  it('modal should show when plus button is clicked', () => {
    // Visit your app's URL or the specific page containing the sidebar
    cy.visit('https://geocraftmaps.azurewebsites.net/');

    // Find the button that triggers the modal and click it
    cy.get('.btn.btn-light.new-map-btn.btn.btn-primary').click();

    // Wait for the modal to be visible (replace '.your-modal-class' with the actual class or identifier of your modal)
    cy.get('.modal-content').should('be.visible');

    // Wait for a moment to allow for any animation or transition to complete
    cy.wait(1000);
  });
});
