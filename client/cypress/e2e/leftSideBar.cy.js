describe('LeftSideBar Component', () => {
  // beforeEach(() => {
  //   cy.visit('https://geocraftmaps.azurewebsites.net/'); 
  // });
  beforeEach(() => {
    // Perform login operation
    cy.visit('https://geocraftmaps.azurewebsites.net/login');
    // Input valid login credentials
    cy.get('[name="email"]').type('elvenli54@gmail.com');
    cy.get('[name="password"]').type('123123123');

    // Submit the form
    cy.get('.form-button').click();
  });

  it('should collapse when the button is clicked', () => {
    // Ensure that the sidebar is initially not collapsed
    cy.get('#left-wrapper').should('not.have.class', 'toggled');

    // Click the button that triggers the collapse
    cy.get('#left-menu-toggle').click();

    // Wait for a moment to allow for any animation or transition to complete
    cy.wait(1000);

    // Assert that the sidebar is collapsed
    cy.get('#left-wrapper').should('have.class', 'toggled');

    // Click the button that triggers the collapse
    cy.get('#left-menu-toggle').click();
  });

  it('modal should show when plus button is clicked', () => {

    // Find the button that triggers the modal and click it
    cy.get('.btn.btn-light.new-map-btn.btn.btn-primary').click();

    // Wait for the modal to be visible (replace '.your-modal-class' with the actual class or identifier of your modal)
    cy.get('.modal-content').should('be.visible');

    // Wait for a moment to allow for any animation or transition to complete
    cy.wait(1000);
  });

  it('should toggle the sidebar on button click', () => {
    cy.get('#left-menu-toggle').click();
    cy.get('#left-wrapper').should('have.class', 'toggled');
  });

  it('should type into the search input', () => {
    const searchText = 'Testing Cypress';

    // Find the comment input and type text
    cy.get('.form-control').eq(0).scrollIntoView().type(searchText);
  });

  it('should handle new map button click', () => {
    cy.get('.new-map-btn').click();

  });

  it('should handle user maps button click', () => {
    cy.get('.user-maps-btn').click();

  });

  it('should handle my maps button click', () => {
    cy.get('.my-maps-btn').click();

  });

  it('should handle query input change', () => {
    const query = 'test query';
    cy.get('#form1').type(query).should('have.value', query);
  });

  it('should handle dropdown item clicks', () => {
    cy.get('.filter-btn').click();
    cy.contains('.dropdown-item', 'Sort by date (newest to oldest)').click();

  });

  it('should interact with MapCard elements and open delete modal', () => {
    cy.get('.map-card').first().find('.options-button').click();
    // Wait for the dropdown to appear (adjust the selector if needed)
    cy.get('.dropdown-menu').should('be.visible');
    // Click on the "Delete" option within the dropdown
    cy.contains('.dropdown-item', 'Delete').click();
    // Wait for the modal to be visible (replace '.your-modal-class' with the actual class or identifier of your modal)
    cy.get('.modal-content').should('be.visible');
  });

  it('should open fork modal', () => {
    cy.get('.map-card').first().find('.options-button').click();
    // Wait for the dropdown to appear (adjust the selector if needed)
    cy.get('.dropdown-menu').should('be.visible');
    // Click on the "Delete" option within the dropdown
    cy.contains('.dropdown-item', 'Fork').click();
    // Wait for the modal to be visible (replace '.your-modal-class' with the actual class or identifier of your modal)
    cy.get('.modal-content').should('be.visible');
  });

  it('should open export modal', () => {
    cy.get('.map-card').first().find('.options-button').click();
    // Wait for the dropdown to appear (adjust the selector if needed)
    cy.get('.dropdown-menu').should('be.visible');
    // Click on the "Delete" option within the dropdown
    cy.contains('.dropdown-item', 'Export').click();
    // Wait for the modal to be visible (replace '.your-modal-class' with the actual class or identifier of your modal)
    cy.get('.modal-content').should('be.visible');
  });
});

