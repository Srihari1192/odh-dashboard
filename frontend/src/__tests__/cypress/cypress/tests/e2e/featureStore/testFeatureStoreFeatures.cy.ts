import * as yaml from 'js-yaml';
import { HTPASSWD_CLUSTER_ADMIN_USER } from '#~/__tests__/cypress/cypress/utils/e2eUsers';
import { featureStoreGlobal } from '#~/__tests__/cypress/cypress/pages/featureStore/featureStoreGlobal';
import {
  shouldHaveInteractiveHoverTooltip,
  shouldHaveInteractiveClickSuccessTooltip,
  shouldHaveTotalCount,
} from '#~/__tests__/cypress/cypress/utils/featureStoreUtils';
import { deleteOpenShiftProject } from '#~/__tests__/cypress/cypress/utils/oc_commands/project';
import { createCleanProject } from '#~/__tests__/cypress/cypress/utils/projectChecker';
import { featuresTable } from '#~/__tests__/cypress/cypress/pages/featureStore/features.ts';
import { featureDetails } from '#~/__tests__/cypress/cypress/pages/featureStore/featuresDetails';
import {
  featureViewsTable,
  featureViewsPage,
} from '#~/__tests__/cypress/cypress/pages/featureStore/featureView.ts';
import type { FeatureStoreTestData } from '#~/__tests__/cypress/cypress/types';
import {
  createFeatureStoreCR,
  createRouteAndGetUrl,
} from '#~/__tests__/cypress/cypress/utils/oc_commands/featureStoreResources.ts';
import { retryableBefore } from '#~/__tests__/cypress/cypress/utils/retryableHooks';
import { generateTestUUID } from '#~/__tests__/cypress/cypress/utils/uuidGenerator';
import { getFeatureCount } from '#~/__tests__/cypress/cypress/utils/api/featureStoreRest.ts';

describe('Feature Store Features Page Validation', () => {
  let testData: FeatureStoreTestData;
  let projectName: string;
  let featureCount: number;
  const uuid = generateTestUUID();
  const testFeatureName = 'city';
  const testFeatureValueType = 'String';
  const testFeatureView = 'zipcode_features';
  const testFeatureDescription = 'City name for the ZIP code';

  retryableBefore(() => {
    cy.fixture('e2e/featureStoreResources/testFeatureStoreResources.yaml', 'utf8')
      .then((yamlContent: string) => {
        testData = yaml.load(yamlContent) as FeatureStoreTestData;
        projectName = `${testData.projectName}-${uuid}`;
      })
      .then(() => {
        cy.log(`Creating Namespace: ${projectName}`);
        createCleanProject(projectName);
        createFeatureStoreCR(projectName, testData.feastInstanceName);
      })
      .then(() => {
        // Create route and fetch feature count
        return createRouteAndGetUrl(projectName, testData.feastInstanceName).then((routeUrl) => {
          return getFeatureCount(routeUrl, testData.feastCreditScoringProject).then((count) => {
            featureCount = count;
            cy.log(`Feature count saved: ${featureCount}`);
            return cy.wrap(count);
          });
        });
      });
  });

  after(() => {
    cy.log(`Deleting Namespace: ${projectName}`);
    deleteOpenShiftProject(projectName, { wait: false, ignoreNotFound: true });
  });

  it(
    'Should display Features and allow searching, navigation, and validate Feature details',
    { tags: ['@Dashboard', '@FeatureStore', '@FeatureFlagged'] },
    () => {
      cy.visitWithLogin('/', HTPASSWD_CLUSTER_ADMIN_USER);

      cy.step(`Navigate to the Feature Store Features page and select feast repository`);
      featureStoreGlobal.navigateToFeatures();
      featureStoreGlobal.selectProject(testData.feastCreditScoringProject);

      cy.step(`Verify the Features table exists and has the correct data`);
      featuresTable.findTable().should('be.visible');
      shouldHaveTotalCount(featureCount);

      cy.step(`Validate that all expected columns exist in the Features table`);
      featuresTable.getFirstRow().within(() => {
        testData.expectedFeaturesColumns.forEach((columnName) => {
          featuresTable.findColumnByDataLabel(columnName).should('exist');
        });
      });

      cy.step(`Search for the feature and verify the details`);
      const featureToolbar = featuresTable.findToolbar();
      featureToolbar.findSearchInput().type(testFeatureName);
      featuresTable.shouldHaveFeatureCount(1);
      featuresTable.findRow(testFeatureName).shouldHaveFeatureName(testFeatureName);
      featuresTable.findRow(testFeatureName).shouldHaveValueType(testFeatureValueType);
      featuresTable.findRow(testFeatureName).shouldHaveFeatureView(testFeatureView);
      featuresTable.findRow(testFeatureName).shouldHaveProject(testData.feastCreditScoringProject);
      featuresTable
        .findRow(testFeatureName)
        .findFeatureView()
        .should('contain.text', testFeatureView);
      featuresTable.findRow(testFeatureName).findFeatureLink().click();

      cy.step(`Verify the Feature details page visible and contains the correct information`);
      featureDetails.findBreadcrumbLink().should('be.visible').should('contain.text', 'Features');
      featureDetails
        .findBreadcrumbItem()
        .should('be.visible')
        .should('contain.text', testFeatureName);
      featureDetails.findPageTitle().should('have.text', testFeatureName);
      featureDetails
        .findApplicationsPageDescription()
        .should('contain.text', testFeatureDescription);
      featureDetails.findFeatureDetailsTab().should('be.visible');
      featureDetails.findFeatureViewsTab().should('be.visible');
      featureDetails.findFeatureTypeLabel().should('have.text', 'Value type');
      featureDetails.findFeatureValueType().should('have.text', testFeatureValueType);
      featureDetails.findFeatureInteractiveExample().should('be.visible');
      featureDetails.findFeatureTagsGroup().should('be.visible');
      featureDetails.findFeatureValueType().should('contain.text', testFeatureValueType);
      featureDetails.findFeatureTypeLabel().should('contain.text', 'Value type');
      featureDetails.findFeatureInteractiveExample().should('be.visible');
      featureDetails.findFeatureTags().should('be.visible');

      cy.step(`Verify Features tooltip of copy to clipboard and success message after click`);
      featureDetails.findInteractiveCodeContent().should('be.visible');
      shouldHaveInteractiveHoverTooltip();
      shouldHaveInteractiveClickSuccessTooltip();
    },
  );

  it(
    'Should validate Feature Views tab functionality in Features Page and details',
    { tags: ['@Dashboard', '@FeatureStore', '@FeatureFlagged'] },
    () => {
      cy.step('Login to the Application');
      cy.visitWithLogin('/', HTPASSWD_CLUSTER_ADMIN_USER);

      cy.step(`Navigate to the Feature Store Features page and select feast repository`);
      featureStoreGlobal.navigateToFeatures();
      featuresTable.findTable().should('be.visible');
      featureStoreGlobal.selectProject(testData.feastCreditScoringProject);

      cy.step(`Search for the feature and verify the details`);
      const featureToolbar = featuresTable.findToolbar();
      featureToolbar.findSearchInput().type(testFeatureName);
      featuresTable.shouldHaveFeatureCount(1);
      featuresTable.findRow(testFeatureName).findFeatureLink().click();

      cy.step(`Verify the Feature views tab`);
      featureDetails.clickFeatureViewsTab();
      const expectedFeatureViewsColumns = ['Feature View', 'Tags', 'Feature services', 'Updated'];

      cy.step(`Validate that all expected columns exist in the Feature Views table`);
      featureViewsTable.getFirstRow().within(() => {
        expectedFeatureViewsColumns.forEach((columnName) => {
          featureViewsTable.findColumnByDataLabel(columnName).should('exist');
        });
      });
      featureViewsTable.shouldHaveFeatureViewCount(1);
      const featureviewToolbar = featureViewsTable.findToolbar();
      featureviewToolbar.findSearchInput().type(testFeatureView);

      cy.step(`Verify the Feature view details`);
      const row = featureViewsTable.findRow(testFeatureView);
      row.findFeatureViewName().should('contain.text', testFeatureView);
      row.findTags().should('be.visible');
      row.findUpdatedDate().should('contain.text', testData.updatedDate);
      row.findFeatureServicesCount().should('contain.text', 4);
      row.findFeatureViewLink().click();
      featureViewsPage.findBreadcrumbLink().should('contain.text', 'Feature views');
      featureViewsPage.findBreadcrumbItem().should('contain.text', testFeatureView);
      featureViewsPage.findPageTitle().should('contain.text', testFeatureView);
    },
  );
});
