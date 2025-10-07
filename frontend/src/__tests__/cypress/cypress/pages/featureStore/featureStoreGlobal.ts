import { appChrome } from '#~/__tests__/cypress/cypress/pages/appChrome';
import { Contextual } from '#~/__tests__/cypress/cypress/pages/components/Contextual';

class FeatureStoreGlobal {
  visit(project?: string) {
    cy.visitWithLogin(
      `/featureStore${project ? `/${project}` : ''}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.wait();
  }

  visitFeatureViews(project: string) {
    const projectName = project;
    cy.visitWithLogin(
      `/featureStore/featureViews/${projectName}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForFeatureViews();
  }

  visitEntities(project?: string) {
    cy.visitWithLogin(
      `/featureStore/entities${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForEntities();
  }

  visitDataSources(project?: string) {
    cy.visitWithLogin(
      `/featureStore/dataSources${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForDataSources();
  }

  visitFeatures(project?: string) {
    const projectName = project;
    cy.visitWithLogin(
      `/featureStore/features${
        projectName ? `/${projectName}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForFeatures();
  }

  visitDataSets(project?: string) {
    cy.visitWithLogin(
      `/featureStore/dataSets${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForDataSets();
  }

  visitDataSetDetails(project: string, dataSetName: string) {
    cy.visitWithLogin(
      `/featureStore/dataSets/${project}/${dataSetName}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForDataSetDetails(dataSetName);
  }

  visitFeatureServices(project: string) {
    const projectName = project;
    cy.visitWithLogin(
      `/featureStore/featureServices/${projectName}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForFeatureServices();
  }

  visitOverview(project?: string) {
    cy.visitWithLogin(
      `/featureStore/overview${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForOverview();
  }

  visitFeatureServiceDetails(project: string, featureService: string) {
    const projectName = project;
    cy.visitWithLogin(
      `/featureStore/featureServices/${projectName}/${featureService}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForFeatureServiceDetails(featureService);
  }

  navigate() {
    appChrome.findNavSection('Feature store').click();
    return this;
  }

  navigateToOverview() {
    appChrome.findNavItem('Overview').click();
    this.waitForOverview();
  }

  navigateToFeatureViews() {
    appChrome.findNavItem('Feature views').click();
    this.waitForFeatureViews();
  }

  navigateToEntities() {
    appChrome.findNavItem('Entities').click();
    this.waitForEntities();
  }

  navigateToFeatures() {
    appChrome.findNavItem('Features').click();
    this.waitForFeatures();
  }

  navigateToDataSources() {
    appChrome.findNavItem('Data sources').click();
    this.waitForDataSources();
  }

  navigateToDatasets() {
    appChrome.findNavItem('Datasets').click();
    this.waitForDataSets();
  }

  navigateToFeatureServices() {
    appChrome.findNavItem('Feature services').click();
    this.waitForFeatureServices();
  }

  findHeading() {
    return cy.findByTestId('app-page-title');
  }

  private wait() {
    cy.findByTestId('app-page-title').should('have.text', 'Feature store overview');
    cy.testA11y();
  }

  private waitForFeatureViews() {
    cy.findByTestId('app-page-title').should('have.text', 'Feature views');
    cy.testA11y();
  }

  private waitForEntities() {
    cy.findByTestId('app-page-title').should('have.text', 'Entities');
    cy.testA11y();
  }

  private waitForFeatures() {
    cy.findByTestId('app-page-title').should('have.text', 'Features');
    cy.testA11y();
  }

  private waitForDataSets() {
    cy.findByTestId('app-page-title').should('have.text', 'Datasets');
    cy.testA11y();
  }

  private waitForDataSetDetails(dataSetName: string) {
    cy.findByTestId('app-page-title').should('have.text', dataSetName);
    cy.testA11y();
  }

  private waitForFeatureServices() {
    cy.findByTestId('app-page-title').should('have.text', 'Feature services');
    cy.testA11y();
  }

  private waitForOverview() {
    cy.findByTestId('app-page-title').should('have.text', 'Feature store overview');
    cy.testA11y();
  }

  private waitForFeatureServiceDetails(serviceName: string) {
    cy.findByTestId('app-page-title').should('have.text', serviceName);
    cy.testA11y();
  }

  private waitForDataSources() {
    cy.findByTestId('app-page-title').should('have.text', 'Data sources');
    cy.testA11y();
  }

  shouldBeEmpty() {
    cy.findByTestId('empty-state-title').should('exist');
    return this;
  }

  shouldShowNoFeatureStoreService() {
    cy.findByTestId('empty-state-feature-store').should('exist');
    return this;
  }

  findProjectSelector() {
    return cy.findByTestId('feature-store-project-selector-toggle');
  }

  findProjectSelectorDropdown() {
    return cy.findByTestId('feature-store-project-selector-menu');
  }

  selectProject(projectName: string) {
    this.findProjectSelector().click();
    this.findProjectSelectorDropdown().should('contain.text', projectName);
    this.findProjectSelectorDropdown().findByRole('menuitem', { name: projectName }).click();
  }

  findGlobalSearchInput() {
    return cy.findByTestId('global-search-input').find('input');
  }

  findGlobalSearchContainer() {
    return cy.findByTestId('global-search-input-container');
  }

  findGlobalSearchMenu() {
    return cy.findByTestId('global-search-menu');
  }

  findGlobalSearchResultsHeader() {
    return cy.findByTestId('global-search-results-header');
  }

  findGlobalSearchResultsCount() {
    return cy.findByTestId('global-search-results-count');
  }

  findGlobalSearchMenuContent() {
    return cy.findByTestId('global-search-menu-content');
  }

  findGlobalSearchMenuList() {
    return cy.findByTestId('global-search-menu-list');
  }

  findGlobalSearchNoResults() {
    return cy.findByTestId('global-search-no-results');
  }

  findGlobalSearchLoadingSpinner() {
    return cy.findByTestId('global-search-loading-spinner');
  }

  findGlobalSearchNoResultsText() {
    return cy.findByTestId('global-search-no-results-text');
  }

  findGlobalSearchLoadMore() {
    return cy.findByTestId('global-search-load-more');
  }

  findGlobalSearchGroup(categoryName: string) {
    const testId = `global-search-group-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
    return cy.findByTestId(testId);
  }

  findGlobalSearchItem(type: string, title: string) {
    const testId = `global-search-item-${type}-${title.toLowerCase().replace(/\s+/g, '-')}`;
    return cy.findByTestId(testId);
  }

  shouldHavePageDescription() {
    return cy.findByTestId('app-page-description').should('be.visible');
  }

  shouldHaveEmptyStateDescription() {
    return cy.findByTestId('empty-state-feature-store').should('be.visible');
  }

  /**
   * Extracts the total count from pagination toggle button
   * @returns Cypress chainable that resolves to the total count number
   * @example
   * // For pagination toggle showing "1 - 10 of 31", this returns 31
   * featureStoreGlobal.getTotalCountFromPagination().then((count) => {
   *   expect(count).to.equal(31);
   * });
   */
  getTotalCountFromPagination(): Cypress.Chainable<number> {
    return cy
      .get('#table-pagination-top-toggle')
      .then(($el) => {
        const paginationText = $el.text().trim();
        const match = paginationText.match(/of\s+(\d+)/);
        if (match && match[1]) {
          const count = parseInt(match[1], 10);
          return cy.wrap(count);
        }
        throw new Error(
          `Could not extract total count from pagination toggle text: ${paginationText}`,
        );
      })
      .then((count) => count);
  }

  /**
   * Asserts that the pagination shows the expected total count
   * @param expectedCount The expected total count
   * @returns this for chaining
   */
  shouldHaveTotalCount(expectedCount: number): this {
    this.getTotalCountFromPagination().then((actualCount) => {
      expect(actualCount).to.equal(expectedCount);
    });
    return this;
  }
}

class FeatureStoreProjectSelector extends Contextual<HTMLElement> {
  findDropdown() {
    return this.find().findByTestId('feature-store-project-selector-dropdown');
  }

  findProjectOption(projectName: string) {
    return cy.findByRole('menuitem', { name: projectName });
  }

  selectProject(projectName: string) {
    this.findDropdown().click();
    this.findProjectOption(projectName).click();
  }

  shouldHaveSelectedProject(projectName: string) {
    this.findDropdown().should('contain.text', projectName);
    return this;
  }
}

class FeatureStoreInteractiveHover {
  shouldHaveInteractiveHoverTooltip(interactiveID: string) {
    cy.get(`#${interactiveID}-button`).trigger('mouseenter');
    cy.get(`#${interactiveID}-button`).trigger('focus');
    // Assert initial tooltip appears with correct text
    return cy
      .get('[role="tooltip"]', { timeout: 3000 })
      .should('be.visible')
      .should('contain.text', 'Copy to clipboard');
  }

  shouldHaveInteractiveClickSuccessTooltip(interactiveID: string) {
    // Ensure document has focus before clipboard operation
    cy.window().then((win) => {
      win.focus();
    });

    // Handle potential clipboard permission issues by catching uncaught exceptions
    cy.on('uncaught:exception', (err) => {
      // Return false to prevent the error from failing the test if it's a clipboard error
      if (err.message.includes('writeText') && err.message.includes('Document is not focused')) {
        return false;
      }
      if (err.name === 'NotAllowedError') {
        return false;
      }
      // Return true for all other errors to let them fail the test as expected
      return true;
    });

    cy.get(`#${interactiveID}-button`).click();
    return cy
      .get('[role="tooltip"]', { timeout: 5000 })
      .should('be.visible')
      .should('contain.text', 'Successfully copied to clipboard!');
  }
}
export const featureStoreInteractiveHover = new FeatureStoreInteractiveHover();

export const featureStoreGlobal = new FeatureStoreGlobal();

export const featureStoreProjectSelector = new FeatureStoreProjectSelector(() =>
  cy.findByTestId('feature-store-project-selector'),
);
