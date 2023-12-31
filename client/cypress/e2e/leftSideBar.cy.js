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

  it('should allow you to look at only your owned maps', () => {
    cy.get('.btn.btn-light.my-maps-btn.btn.btn-primary').click();

  });

  it('should be able to search owned maps', () => {
    const commentText = 'Testing Cypress';
    // Find the comment input, type text, and check the value
    cy.get('.form-control.query').eq(0).type(commentText);    
    cy.get('.form-control.query').eq(0).should('have.value', commentText);
  });

  it('should allow you to browse another user profile', () => {
    cy.get('.owner-link').eq(0).click();

  });

  it('should filter the maps', () => {
    cy.get('.dropdown-toggle.btn.btn-light').click();

  });

  it('should filter the maps newest to oldest', () => {
    cy.get('.dropdown-toggle.btn.btn-light').click();
    cy.get('.dropdown-item').eq(0).click();

  });

  it('should filter the maps oldest to newest', () => {
    cy.get('.dropdown-toggle.btn.btn-light').click();
    cy.get('.dropdown-item').eq(1).click();

  });

  it('should filter the maps a - z', () => {
    cy.get('.dropdown-toggle.btn.btn-light').click();
    cy.get('.dropdown-item').eq(2).click();

  });

  it('should filter the maps z - a', () => {
    cy.get('.dropdown-toggle.btn.btn-light').click();
    cy.get('.dropdown-item').eq(3).click();

  });

  it('should filter the maps by most popular', () => {
    cy.get('.dropdown-toggle.btn.btn-light').click();
    cy.get('.dropdown-item').eq(4).click();

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
    cy.get('.map-card').first().click();
    cy.get('.map-card').first().find('.options-button').click();
    // Wait for the dropdown to appear (adjust the selector if needed)
    cy.get('.dropdown-menu').should('be.visible');
  });

  it('should toggle sidebar', () => {
    cy.get('#left-menu-toggle').click();
  });

  it('should handle sort by newest', () => {
    cy.get('.filter-btn .dropdown-toggle').click();
    cy.get('.dropdown-menu').contains('Sort by date (newest to oldest)').click();
  });

  it('should handle sort by oldest', () => {
    cy.get('.filter-btn .dropdown-toggle').click();
    cy.get('.dropdown-menu').contains('Sort by date (oldest to newest)').click();
  });

  it('should handle sort alphabetically A to Z', () => {
    cy.get('.filter-btn .dropdown-toggle').click();
    cy.get('.dropdown-menu').contains('Sort Alphabetically (A to Z)').click();
  });

  it('should handle sort alphabetically Z to A', () => {
    cy.get('.filter-btn .dropdown-toggle').click();
    cy.get('.dropdown-menu').contains('Sort Alphabetically (Z to A)').click();
  });

  it('should handle sort by popular', () => {
    cy.get('.filter-btn .dropdown-toggle').click();
    cy.get('.dropdown-menu').contains('Most popular').click();
  });
});

