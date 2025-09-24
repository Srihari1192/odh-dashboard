import { Contextual } from '#~/__tests__/cypress/cypress/pages/components/Contextual';

class FeatureViewDetails extends Contextual<HTMLElement> {
  findBreadcrumbLink() {
    return cy.get('ol.pf-v6-c-breadcrumb__list').find('a');
  }

  findBreadcrumbItem() {
    return cy.findByTestId('breadcrumb-version-name');
  }

  findFeatureViewTitle() {
    return cy.findByTestId('app-page-title');
  }

  findFeatureViewDescription() {
    return cy.findByTestId('app-page-description');
  }

  findFeatureViewDetailsTab() {
    return cy.findByTestId('feature-view-details-tab');
  }

  findFeatureViewsLineageTab() {
    return cy.findByTestId('lineage-feature-views-tab');
  }

  findFeatureViewsConsumingFeatureServicesTab() {
    return cy.findByTestId('consuming-feature-services-tab');
  }

  findFeatureViewsMaterializationTab() {
    return cy.findByTestId('feature-view-materialization-tab');
  }

  findFeatureViewsTransformationsTab() {
    return cy.findByTestId('feature-view-transformations-tab');
  }

  findOverviewFeatureViewValue() {
    return cy.findByTestId('overview-feature-view-value');
  }

  findFeatureTags() {
    return cy.findByTestId('feature-store-tags-group');
  }

  findFeatureViewEntitiesTitle() {
    return cy.findByTestId('feature-view-entities-title');
  }

  findFeatureViewDataSourcesTable() {
    return cy.findByTestId('feature-view-data-sources-table');
  }

  findRows() {
    return this.findFeatureViewDataSourcesTable().find('tbody tr');
  }

  findFeatureInteractiveExample() {
    return cy.findByTestId('feature-view-interactive-example-title');
  }

  shouldHaveFeatureInteractiveExample() {
    this.findFeatureInteractiveExample().should('be.visible');
    return this;
  }

  shouldHaveRow(index: number, sourceType: string, dataSourceName: string, dataSourceHref: string) {
    this.findRows()
      .eq(index)
      .within(() => {
        // Verify Source Type cell
        cy.get('td').eq(0).should('have.text', sourceType);

        // Verify Data Source link cell
        cy.get('td')
          .eq(1)
          .find('a')
          .should('have.text', dataSourceName)
          .and('have.attr', 'href', dataSourceHref);
      });
    return this;
  }

  shouldHaveFeatureViewDataSourcesCount(count: number) {
    return this.findRows().should('have.length', count);
  }

  shouldHaveFeatureTags(tag: string) {
    this.findFeatureTags().should('contain.text', tag);
    return this;
  }

  shouldHaveFeatureViewEntitiesTitle() {
    this.findFeatureViewEntitiesTitle().should('contain.text', 'Entities');
    return this;
  }

  shouldHaveFeatureViewEntitiesName(name: string) {
    this.findFeatureViewEntitiesTitle().parent().find('a').should('contain.text', name);
    return this;
  }

  shouldHaveFeatureCount(count: number) {
    this.findOverviewFeatureViewValue()
      .find('.pf-v6-c-label__text')
      .first()
      .should('contain.text', `${count} feature`);
    return this;
  }

  shouldHaveConsumingServices(count: number) {
    this.findOverviewFeatureViewValue()
      .find('.pf-v6-c-label__text')
      .eq(1)
      .should('contain.text', `${count} consuming services`);
    return this;
  }

  shouldHaveBreadcrumbLink(link: string) {
    this.findBreadcrumbLink().should('contain.text', link);
    return this;
  }

  shouldHaveBreadcrumbItem(item: string) {
    this.findBreadcrumbItem().should('contain.text', item);
    return this;
  }

  shouldHaveFeatureViewTitle(title: string) {
    this.findFeatureViewTitle().should('contain.text', title);
    return this;
  }

  shouldHaveFeatureViewDescription(description: string) {
    this.findFeatureViewDescription().should('contain.text', description);
    return this;
  }

  shouldHaveFeatureViewLabel(label: string) {
    cy.findByTestId('app-page-title').find('.pf-v6-c-label__text').should('contain.text', label);
    return this;
  }

  clickFeatureViewDetailsTab() {
    this.findFeatureViewDetailsTab().click();
    return this;
  }

  clickFeatureViewsLineageTab() {
    this.findFeatureViewsLineageTab().click();
    return this;
  }

  clickFeatureViewsConsumingFeatureServicesTab() {
    this.findFeatureViewsConsumingFeatureServicesTab().click();
    return this;
  }

  clickFeatureViewsMaterializationTab() {
    this.findFeatureViewsMaterializationTab().click();
    return this;
  }

  clickFeatureViewsTransformationsTab() {
    this.findFeatureViewsTransformationsTab().click();
    return this;
  }

  shouldHaveFeatureViewDetailsTabSelected() {
    this.findFeatureViewDetailsTab().should('be.visible').and('not.be.disabled');
    return this;
  }

  shouldHaveFeatureViewsLineageTabSelected() {
    this.findFeatureViewsLineageTab().should('be.visible').and('not.be.disabled');
    return this;
  }

  shouldHaveFeatureViewsConsumingFeatureServicesTabSelected() {
    this.findFeatureViewsConsumingFeatureServicesTab().should('be.visible').and('not.be.disabled');
    return this;
  }

  shouldHaveFeatureViewsMaterializationTabSelected() {
    this.findFeatureViewsMaterializationTab().should('be.visible').and('not.be.disabled');
    return this;
  }

  shouldHaveFeatureViewsTransformationsTabSelected() {
    this.findFeatureViewsTransformationsTab().should('be.visible').and('not.be.disabled');
    return this;
  }

  shouldHaveTabsExist() {
    this.findFeatureViewDetailsTab().should('exist');
    this.findFeatureViewsLineageTab().should('exist');
    this.findFeatureViewsConsumingFeatureServicesTab().should('exist');
    this.findFeatureViewsMaterializationTab().should('exist');
    this.findFeatureViewsTransformationsTab().should('exist');
    return this;
  }

  shouldHaveTabsVisibleAndClickable() {
    this.findFeatureViewDetailsTab().should('be.visible').and('not.be.disabled');
    this.findFeatureViewsLineageTab().should('be.visible').and('not.be.disabled');
    this.findFeatureViewsConsumingFeatureServicesTab().should('be.visible').and('not.be.disabled');
    this.findFeatureViewsMaterializationTab().should('be.visible').and('not.be.disabled');
    this.findFeatureViewsTransformationsTab().should('be.visible').and('not.be.disabled');
    return this;
  }
}

class FeatureViewLineageDetails extends Contextual<HTMLElement> {
  findSchemaTable() {
    return cy.findByTestId('feature-view-lineage');
  }

  shouldHaveFeatureViewLineageTitle() {
    this.findSchemaTable().should('contain.text', 'Schema');
    return this;
  }

  findFeatureViewLineageTable() {
    return cy.findByTestId('feature-view-schema-table');
  }

  findFeatureViewLineagGraph() {
    return cy.findByTestId('feature-view-schema');
  }

  shouldHaveFeatureViewLineageGraph() {
    this.findFeatureViewLineagGraph().should('be.visible');
    return this;
  }

  findRows() {
    return this.findFeatureViewLineageTable().find('tbody tr');
  }

  shouldHaveRow(
    index: number,
    columnName: string,
    type: string,
    dataType: string,
    description: string,
    columnHref?: string,
  ) {
    this.findRows()
      .eq(index)
      .within(() => {
        // Column (can be plain text or link)
        if (columnHref) {
          cy.get('td')
            .eq(0)
            .find('a')
            .should('have.text', columnName)
            .and('have.attr', 'href', columnHref);
        } else {
          cy.get('td').eq(0).should('have.text', columnName);
        }

        // Type
        cy.get('td').eq(1).should('have.text', type);

        // Data Type
        cy.get('td').eq(2).should('have.text', dataType);

        // Description
        cy.get('td').eq(3).should('have.text', description);
      });

    return this;
  }
}

export const featureViewLineageDetails = new FeatureViewLineageDetails();

export const featureViewsDetails = new FeatureViewDetails(() =>
  cy.findByTestId('feature-view-details-page'),
);
