class FeatureStoreLineage {
  // Zoom Control Finders
  findZoomInButton() {
    return cy.get('#zoom-in');
  }

  findZoomOutButton() {
    return cy.get('#zoom-out');
  }

  findFitToScreenButton() {
    return cy.get('#fit-to-screen');
  }

  findResetViewButton() {
    return cy.get('#reset-view');
  }

  // Existence Check Methods
  shouldHaveZoomInButton() {
    this.findZoomInButton().should('be.visible').should('not.be.disabled');
    return this;
  }

  shouldHaveZoomOutButton() {
    this.findZoomOutButton().should('be.visible').should('not.be.disabled');
    return this;
  }

  shouldHaveFitToScreenButton() {
    this.findFitToScreenButton().should('be.visible').should('not.be.disabled');
    return this;
  }

  shouldHaveResetViewButton() {
    this.findResetViewButton().should('be.visible').should('not.be.disabled');
    return this;
  }

  shouldHaveAllZoomControls() {
    this.shouldHaveZoomInButton();
    this.shouldHaveZoomOutButton();
    this.shouldHaveFitToScreenButton();
    this.shouldHaveResetViewButton();
    return this;
  }

  // Click Methods
  clickZoomIn() {
    cy.step('Click Zoom In button');
    this.findZoomInButton().click();
    return this;
  }

  clickZoomOut() {
    cy.step('Click Zoom Out button');
    this.findZoomOutButton().click();
    return this;
  }

  clickFitToScreen() {
    cy.step('Click Fit to Screen button');
    this.findFitToScreenButton().click();
    return this;
  }

  clickResetView() {
    cy.step('Click Reset View button');
    this.findResetViewButton().click();
    return this;
  }

  // Combined Methods for Testing Sequences
  testZoomControls() {
    cy.step('Test all zoom control interactions');
    this.shouldHaveAllZoomControls();
    this.clickZoomIn();
    this.clickZoomOut();
    this.clickFitToScreen();
    this.clickResetView();
    return this;
  }

  // Verify button states
  shouldHaveZoomControlsEnabled() {
    this.findZoomInButton().should('not.be.disabled');
    this.findZoomOutButton().should('not.be.disabled');
    this.findFitToScreenButton().should('not.be.disabled');
    this.findResetViewButton().should('not.be.disabled');
    return this;
  }
}

class FeatureViewLineage {
  findPageTitle() {
    return cy.findByTestId(`feature-view-lineage`);
  }

  shouldHaveFeatureViewLineageTitle() {
    this.findPageTitle().should('contain.text', 'Lineage');
    return this;
  }

  findLinageSearchFilterDropdown() {
    return cy.findByTestId(`lineage-search-filter-dropdown`);
  }

  findLinageSearchFilterDropdownItem(item: string) {
    return this.findLinageSearchFilterDropdown().findByTestId(
      `lineage-search-filter-dropdown-item-${item}`,
    );
  }

  shouldHaveLinageSearchFilterDropdown() {
    return cy.findByTestId(`lineage-search-filter-dropdown`).should('be.visible');
  }

  shouldHaveFeatureViewLineageSearchFilterDropdown() {
    this.shouldHaveLinageSearchFilterDropdown().should('be.visible');
    return this;
  }

  findFeatureViewLineageGraph() {
    return cy.findByTestId(`feature-view-lineage-graph`);
  }

  shouldHaveFeatureViewLineageGraph() {
    this.findFeatureViewLineageGraph().should('be.visible');
    return this;
  }

  findFeatureViewLineageTable() {
    return cy.findByTestId(`feature-view-lineage-table`);
  }

  shouldHaveFeatureViewLineageTable() {
    this.findFeatureViewLineageTable().should('be.visible');
    return this;
  }

  // Lineage Search Methods
  findLineageSearchInput() {
    return cy.findByTestId(`lineage-search-filter-text-field`);
  }

  shouldHaveLineageSearchInput() {
    this.findLineageSearchInput().should('be.visible').should('not.be.disabled');
    return this;
  }

  typeInLineageSearch(searchText: string) {
    this.findLineageSearchInput().clear().type(searchText);
    return this;
  }

  shouldHaveLineageSearchPlaceholder() {
    this.findLineageSearchInput().should('have.attr', 'placeholder', 'Search entities...');
    return this;
  }

  // Filter Dropdown Methods
  findFilterDropdownToggle() {
    return cy.findByTestId('lineage-search-filter-dropdown');
  }

  shouldHaveFilterDropdownToggle() {
    this.findFilterDropdownToggle().should('be.visible').should('not.be.disabled');
    return this;
  }

  openFilterDropdown() {
    cy.step('Open filter dropdown');
    this.findFilterDropdownToggle().click();
    this.findFilterDropdownToggle().should('have.attr', 'aria-expanded', 'true');
    return this;
  }

  closeFilterDropdown() {
    cy.step('Close filter dropdown');
    // Click outside to close or press escape
    cy.get('body').click(0, 0);
    this.findFilterDropdownToggle().should('have.attr', 'aria-expanded', 'false');
    return this;
  }

  shouldHaveFilterDropdownCurrentSelection(expectedText: string) {
    this.findFilterDropdownToggle()
      .find('.pf-v6-c-menu-toggle__text')
      .should('contain.text', expectedText);
    return this;
  }

  // Generic method to find dropdown menu items
  findDropdownMenu() {
    return cy.get('[role="menu"]').should('be.visible');
  }

  findDropdownMenuItem(itemText: string) {
    return this.findDropdownMenu().contains('[role="menuitem"]', itemText);
  }

  // Assert dropdown menu items exist
  shouldHaveDropdownMenuItems(expectedItems: string[]) {
    this.openFilterDropdown();
    expectedItems.forEach((item) => {
      this.findDropdownMenuItem(item).should('be.visible');
    });
    return this;
  }

  // Select item from dropdown
  selectFilterDropdownItem(itemText: string) {
    cy.step(`Select "${itemText}" from filter dropdown`);
    this.openFilterDropdown();
    this.findDropdownMenuItem(itemText).click();
    this.shouldHaveFilterDropdownCurrentSelection(itemText);
    return this;
  }

  // Convenience methods for common filter types
  selectEntityFilter() {
    return this.selectFilterDropdownItem('Entity');
  }

  selectFeatureViewFilter() {
    return this.selectFilterDropdownItem('Feature View');
  }

  selectDataSourceFilter() {
    return this.selectFilterDropdownItem('Data Source');
  }
}

export const featureStoreLineage = new FeatureStoreLineage();
export const featureViewLineage = new FeatureViewLineage();
