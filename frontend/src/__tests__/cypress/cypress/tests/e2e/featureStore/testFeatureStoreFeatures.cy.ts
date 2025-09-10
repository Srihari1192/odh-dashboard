import * as yaml from 'js-yaml';
import { deleteOpenShiftProject } from '#~/__tests__/cypress/cypress/utils/oc_commands/project';
import { createCleanProject } from '#~/__tests__/cypress/cypress/utils/projectChecker';
import { featureStoreGlobal } from '#~/__tests__/cypress/cypress/pages/featureStore/featureStoreGlobal.ts';
import { featuresTable } from '#~/__tests__/cypress/cypress/pages/featureStore/features.ts';
import { featureDetails } from '#~/__tests__/cypress/cypress/pages/featureStore/featuresDetails';
import { featureViewsTable } from '#~/__tests__/cypress/cypress/pages/featureStore/featureView.ts';
import type { FeatureStoreTestData, AWSS3BucketDetails } from '#~/__tests__/cypress/cypress/types';
import { createFeatureStoreCR } from '#~/__tests__/cypress/cypress/utils/oc_commands/featureStoreResources.ts';
import { waitForPodReady } from '#~/__tests__/cypress/cypress/utils/oc_commands/baseCommands';
import { retryableBefore } from '#~/__tests__/cypress/cypress/utils/retryableHooks';
import { AWS_BUCKETS } from '#~/__tests__/cypress/cypress/utils/s3Buckets';
import { generateTestUUID } from '#~/__tests__/cypress/cypress/utils/uuidGenerator';

describe('Feature Store Features Page Validation', () => {
  let testData: FeatureStoreTestData;
  let projectName: string;
  let s3Config: AWSS3BucketDetails;
  let s3AccessKey: string;
  let s3SecretKey: string;
  const uuid = generateTestUUID();

  retryableBefore(() => {
    const bucketConfig = AWS_BUCKETS.BUCKET_1;
    s3Config = bucketConfig;
    s3AccessKey = AWS_BUCKETS.AWS_ACCESS_KEY_ID;
    s3SecretKey = AWS_BUCKETS.AWS_SECRET_ACCESS_KEY;

    cy.fixture('e2e/featureStoreResources/testFeatureStoreResources.yaml', 'utf8')
      .then((yamlContent: string) => {
        testData = yaml.load(yamlContent) as FeatureStoreTestData;
        projectName = `${testData.projectName}-${uuid}`;
      })
      .then(() => {
        cy.log(`Creating Namespace: ${projectName}`);
        createCleanProject(projectName);
        createFeatureStoreCR(s3AccessKey, s3SecretKey, s3Config.NAME, s3Config.REGION, projectName);
        waitForPodReady('feast-test-s3', '300s');
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
      cy.step(`Navigate to the Feature Store page `);
      featureStoreGlobal.visitFeatureStore();
      featureStoreGlobal.navigateToFeatures();
      featuresTable.findTable().should('be.visible');
      featureStoreGlobal.selectProject(testData.feastCreditScoringProject);
      featuresTable.shouldHaveFeatureCount(10);

      const featureToolbar = featuresTable.findToolbar();
      featuresTable
        .findRows()
        .first()
        .within(() => {
          testData.expectedFeaturesColumns.forEach((columnName) => {
            cy.get(`[data-label="${columnName}"]`).should('exist');
          });
        });
      featureToolbar.findSearchInput().type('city');
      featuresTable.shouldHaveFeatureCount(1);
      featuresTable.findRow('city').shouldHaveFeatureName('city');
      featuresTable.findRow('city').shouldHaveValueType('String');
      featuresTable.findRow('city').shouldHaveFeatureView('zipcode_features');
      featuresTable.findRow('city').shouldHaveProject(testData.feastCreditScoringProject);
      featuresTable.findRow('city').findFeatureView().should('contain.text', 'zipcode_features');
      featuresTable.findRow('city').findFeatureLink().click();

      //verify details page
      featureDetails.findBreadcrumbLink().should('be.visible').should('contain.text', 'Features');
      featureDetails.findBreadcrumbItem().should('be.visible').should('contain.text', 'city');
      featureDetails
        .shouldHavePageTitle('city')
        .shouldHaveApplicationsPageDescription('City name for the ZIP code')
        .shouldHaveTabsExist()
        .shouldHaveTabsVisibleAndClickable()
        .shouldHaveFeatureValueType('String')
        .shouldHaveFeatureTypeLabel('Value type')
        .shouldHaveFeatureInteractiveExample()
        .shouldHaveFeatureTags()
        .shouldHaveFeatureTagsText('enrichment=location');

      // Trigger hover to show initial tooltip
      cy.get('#city-button').trigger('mouseenter');
      cy.get('#city-button').trigger('focus');
      // Assert initial tooltip appears with correct text
      cy.get('[role="tooltip"]', { timeout: 3000 })
        .should('be.visible')
        .should('contain.text', 'Copy to clipboard');

      cy.contains('from feast import Feature').should('be.visible');
      cy.contains('city = Feature(').should('be.visible');

      // Click the button to trigger copy action
      cy.get('#city-button').click();
      // Wait for tooltip to update with success message after click
      cy.get('[role="tooltip"]', { timeout: 5000 })
        .should('be.visible')
        .should('contain.text', 'Successfully copied to clipboard!');
    },
  );

  it(
    'Should validate Feature Views tab functionality in Features Page and details',
    { tags: ['@Dashboard', '@FeatureStore', '@FeatureFlagged'] },
    () => {
      cy.step(`Navigate to the Feature Store page and access Feature Views`);
      featureStoreGlobal.visitFeatureStore();
      featureStoreGlobal.navigateToFeatures();
      featuresTable.findTable().should('be.visible');
      featureStoreGlobal.selectProject(testData.feastCreditScoringProject);

      // Navigate to a feature to access Feature Views tab
      const featureToolbar = featuresTable.findToolbar();
      featureToolbar.findSearchInput().type('city');
      featuresTable.shouldHaveFeatureCount(1);
      featuresTable.findRow('city').findFeatureLink().click();

      // verify feature views tab
      featureDetails.clickFeatureViewsTab();
      featureViewsTable
        .findRows()
        .first()
        .within(() => {
          testData.expectedFeatureViewsColumns.forEach((columnName) => {
            cy.get(`[data-label="${columnName}"]`).should('exist');
          });
        });
      featureViewsTable.shouldHaveFeatureViewCount(1);
      const featureviewToolbar = featureViewsTable.findToolbar();
      featureviewToolbar.findSearchInput().type('zipcode_features');

      const row = featureViewsTable.findRow('zipcode_features');
      row.shouldHaveFeatureViewName('zipcode_features');
      row.shouldHaveFeaturesCount(6);
      row.shouldHaveOwner('risk-team@company.com');
      row.shouldHaveTag('pii=false');
      row.shouldHaveTag('domain=demographics');
      row.shouldHaveProject(testData.feastCreditScoringProject);
      row.shouldHaveStoreType('Online');
      row.clickFeatureViewLink();
      cy.contains('Feature views').should('be.visible');
      cy.contains('zipcode_features').should('be.visible');
    },
  );
});
