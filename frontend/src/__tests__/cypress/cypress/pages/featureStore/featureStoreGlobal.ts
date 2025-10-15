import { appChrome } from '#~/__tests__/cypress/cypress/pages/appChrome';
import { Contextual } from '#~/__tests__/cypress/cypress/pages/components/Contextual';
import {
  getTotalCountFromPagination,
  shouldHaveInteractiveClickSuccessTooltip as handleInteractiveClickSuccess,
} from '#~/__tests__/cypress/cypress/utils/featureStoreUtils';

class FeatureStoreGlobal {
  visit(project?: string) {
    cy.visitWithLogin(
      `/develop-train/feature-store${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.wait();
  }

  visitFeatureViews(project: string) {
    const projectName = project;
    cy.visitWithLogin(
      `/develop-train/feature-store/feature-views/${projectName}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForFeatureViews();
  }

  visitEntities(project?: string) {
    cy.visitWithLogin(
      `/develop-train/feature-store/entities${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForEntities();
  }

  visitDataSources(project?: string) {
    cy.visitWithLogin(
      `/develop-train/feature-store/data-sources${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForDataSources();
  }

  visitFeatures(project?: string) {
    const projectName = project;
    cy.visitWithLogin(
      `/develop-train/feature-store/features${
        projectName ? `/${projectName}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForFeatures();
  }

  visitDataSets(project?: string) {
    cy.visitWithLogin(
      `/develop-train/feature-store/datasets${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForDataSets();
  }

  visitDataSetDetails(project: string, dataSetName: string) {
    cy.visitWithLogin(
      `/develop-train/feature-store/datasets/${project}/${dataSetName}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForDataSetDetails(dataSetName);
  }

  visitFeatureServices(project: string) {
    const projectName = project;
    cy.visitWithLogin(
      `/develop-train/feature-store/feature-services/${projectName}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForFeatureServices();
  }

  visitOverview(project?: string) {
    cy.visitWithLogin(
      `/develop-train/feature-store/overview${
        project ? `/${project}` : ''
      }?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForOverview();
  }

  visitFeatureServiceDetails(project: string, featureService: string) {
    const projectName = project;
    cy.visitWithLogin(
      `/develop-train/feature-store/feature-services/${projectName}/${featureService}?devFeatureFlags=Feature+store+plugin%3Dtrue`,
    );
    this.waitForFeatureServiceDetails(featureService);
  }

  navigate(){
    appChrome
      .findNavItem({
        name: 'Feature store',
        rootSection: 'Develop & train',
      })
      .click();
    this.wait();
  }

  navigateToOverview() {
    appChrome
      .findNavItem({
        name: 'Overview',
        rootSection: 'Develop & train',
        subSection: 'Feature store',
      })
      .click();
    this.waitForOverview();
  }

  navigateToFeatureViews() {
    appChrome
      .findNavItem({
        name: 'Feature views',
        rootSection: 'Develop & train',
        subSection: 'Feature store',
      })
      .click();
    this.waitForFeatureViews();
  }

  navigateToEntities() {
    appChrome
      .findNavItem({
        name: 'Entities',
        rootSection: 'Develop & train',
        subSection: 'Feature store',
      })
      .click();
    this.waitForEntities();
  }

  navigateToFeatures() {
    appChrome
      .findNavItem({
        name: 'Features',
        rootSection: 'Develop & train',
        subSection: 'Feature store',
      })
      .click();
    this.waitForFeatures();
  }

  navigateToDataSources() {
    appChrome
      .findNavItem({
        name: 'Data sources',
        rootSection: 'Develop & train',
        subSection: 'Feature store',
      })
      .click();
    this.waitForDataSources();
  }

  navigateToDatasets() {
    appChrome
      .findNavItem({
        name: 'Datasets',
        rootSection: 'Develop & train',
        subSection: 'Feature store',
      })
      .click();
    this.waitForDataSets();
  }

  navigateToFeatureServices() {
    appChrome
      .findNavItem({
        name: 'Feature services',
        rootSection: 'Develop & train',
        subSection: 'Feature store',
      })
      .click();
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

  findColumn(columnName: string) {
    return cy.find(`[data-label="${columnName }"]`);
  }

  findPaginationToggle() {
    return cy.get('#table-pagination-top-toggle');
  }

  findInteractiveCopyButton(interactiveID: string) {
    return cy.get(`#${interactiveID}-button`);
  }

  // Asserts that the pagination shows the expected total count
  shouldHaveTotalCount(expectedCount: number): this {
    getTotalCountFromPagination().then((actualCount) => {
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
    return handleInteractiveClickSuccess(interactiveID);
  }
}
export const featureStoreInteractiveHover = new FeatureStoreInteractiveHover();

export const featureStoreGlobal = new FeatureStoreGlobal();

export const featureStoreProjectSelector = new FeatureStoreProjectSelector(() =>
  cy.findByTestId('feature-store-project-selector'),
);
