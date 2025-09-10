import * as yaml from 'js-yaml';
import { deleteOpenShiftProject } from '#~/__tests__/cypress/cypress/utils/oc_commands/project';
import { createCleanProject } from '#~/__tests__/cypress/cypress/utils/projectChecker';
import {
  featureStoreGlobal,
  featureStoreInteractiveHover,
} from '#~/__tests__/cypress/cypress/pages/featureStore/featureStoreGlobal.ts';
import { featureViewsTable } from '#~/__tests__/cypress/cypress/pages/featureStore/featureView.ts';
import {
  featureViewLineageDetails,
  featureViewsDetails,
} from '#~/__tests__/cypress/cypress/pages/featureStore/featureViewDetails.ts';
import type { FeatureStoreTestData } from '#~/__tests__/cypress/cypress/types';
import { createFeatureStoreCR } from '#~/__tests__/cypress/cypress/utils/oc_commands/featureStoreResources.ts';
import { waitForPodReady } from '#~/__tests__/cypress/cypress/utils/oc_commands/baseCommands';
import { retryableBefore } from '#~/__tests__/cypress/cypress/utils/retryableHooks';
import { generateTestUUID } from '#~/__tests__/cypress/cypress/utils/uuidGenerator';

describe('Feature Store Feature views Page Validation', () => {
  let testData: FeatureStoreTestData;
  let projectName: string;
  const uuid = generateTestUUID();

  retryableBefore(() => {
    cy.fixture('e2e/featureStoreResources/testFeatureStoreResources.yaml', 'utf8')
      .then((yamlContent: string) => {
        testData = yaml.load(yamlContent) as FeatureStoreTestData;
        projectName = `${testData.projectName}-${uuid}`;
      })
      .then(() => {
        cy.log(`Creating Namespace: ${projectName}`);
        createCleanProject(projectName);
        createFeatureStoreCR(projectName);
        waitForPodReady('feast-test-s3', '300s');
      });
  });

  after(() => {
    cy.log(`Deleting Namespace: ${projectName}`);
    deleteOpenShiftProject(projectName, { wait: false, ignoreNotFound: true });
  });
  it(
    'Should display Feature views list and validate Feature views details',
    { tags: ['@Dashboard', '@FeatureStore', '@FeatureFlagged'] },
    () => {
      cy.step(`Navigate to the Feature Store page `);
      featureStoreGlobal.visitFeatureStore();
      featureStoreGlobal.navigateToFeatureViews();
      featureViewsTable.findTable().should('be.visible');
      featureStoreGlobal.selectProject(testData.feastCreditScoringProject);
      featureViewsTable.shouldHaveFeatureViewCount(8);
      featureViewsTable
        .findRows()
        .first()
        .within(() => {
          testData.expectedFeatureViewsColumns.forEach((columnName) => {
            cy.get(`[data-label="${columnName}"]`).should('exist');
          });
        });
      featureViewsTable.findToolbar().findSearchInput().type('zipcode_features');
      featureViewsTable.shouldHaveFeatureViewCount(1);
      featureViewsTable.findRow('zipcode_features').shouldHaveFeatureViewName('zipcode_features');
      featureViewsTable
        .findRow('zipcode_features')
        .shouldHaveFeatureViewDescription(
          'Geographic and demographic features aggregated by ZIP code for credit risk assessment',
        );
      featureViewsTable.findRow('zipcode_features').shouldHaveStoreTypeLabel('Batch');
      featureViewsTable.findRow('zipcode_features').shouldHaveFeaturesCount(6);
      featureViewsTable.findRow('zipcode_features').shouldHaveOwner('risk-team@company.com');
      featureViewsTable
        .findRow('zipcode_features')
        .shouldHaveProject(testData.feastCreditScoringProject);
      featureViewsTable.findRow('zipcode_features').shouldHaveStoreType('Online');
      featureViewsTable.findRow('zipcode_features').shouldHaveCreatedDate('2025');
      featureViewsTable.findRow('zipcode_features').shouldHaveUpdatedDate('2025');
    },
  );

  it(
    'Should validate Feature Views Details and its Lineage, Consuming Feature services , Materialization and Transformations tabs',
    { tags: ['@Dashboard', '@FeatureStore', '@FeatureFlagged'] },
    () => {
      cy.step(`Navigate to the Feature Store page and access Feature Views`);
      featureStoreGlobal.visitFeatureStore();
      featureStoreGlobal.navigateToFeatureViews();
      featureStoreGlobal.selectProject(testData.feastCreditScoringProject);
      featureViewsTable.findToolbar().findSearchInput().type('total_debt_calc');
      featureViewsTable.findRow('total_debt_calc').clickFeatureViewLink();

      featureViewsDetails.shouldHaveFeatureViewTitle('total_debt_calc');
      featureViewsDetails.shouldHaveBreadcrumbLink('Feature views');
      featureViewsDetails.shouldHaveBreadcrumbItem('total_debt_calc');
      featureViewsDetails.shouldHaveFeatureViewDescription(
        'Calculated total debt burden including existing debts and new loan amount for debt-to-income analysis',
      );
      featureViewsDetails.shouldHaveFeatureViewLabel('On demand');
      featureViewsDetails.shouldHaveFeatureViewDetailsTabSelected();
      featureViewsDetails.shouldHaveTabsExist();
      featureViewsDetails
        .shouldHaveFeatureCount(1)
        .shouldHaveConsumingServices(2)
        .shouldHaveFeatureViewEntitiesTitle()
        .shouldHaveFeatureViewEntitiesName('__dummy')
        .shouldHaveFeatureTags('team=risk')
        .shouldHaveFeatureTags('domain=credit')
        .shouldHaveFeatureTags('category=debt_ratio')
        .shouldHaveFeatureTags('computation=derived')
        .shouldHaveFeatureViewDataSourcesCount(2);
      // Row 0 → On-Demand + application_data
      featureViewsDetails.shouldHaveRow(
        0,
        'On-Demand',
        'application_data',
        '/featureStore/dataSources/credit_scoring_local/application_data',
      );

      // Row 1 → Projection + Credit history
      featureViewsDetails.shouldHaveRow(
        1,
        'Projection',
        'Credit history',
        '/featureStore/dataSources/credit_scoring_local/Credit history',
      );
      featureViewsDetails.shouldHaveFeatureInteractiveExample();
      featureStoreInteractiveHover.shouldHaveInteractiveHoverTooltip('total_debt_calc');
      featureStoreInteractiveHover.shouldHaveInteractiveClickSuccessTooltip('total_debt_calc');
      cy.contains('def total_debt_calc(inputs').should('be.visible');

      //lineage tab
      featureViewsDetails.clickFeatureViewsLineageTab();
      featureViewLineageDetails.shouldHaveFeatureViewLineageTitle();
      // Row 0 → __dummy_id (Entity)
      featureViewLineageDetails.shouldHaveRow(
        0,
        '__dummy_id',
        'ENTITY',
        'STRING',
        '-',
        '/featureStore/entities/credit_scoring_local/__dummy_id',
      );

      // Row 1 → total_debt_due (Feature)
      featureViewLineageDetails.shouldHaveRow(
        1,
        'total_debt_due',
        'FEATURE',
        'DOUBLE',
        '-',
        '/featureStore/features/credit_scoring_local/total_debt_calc/total_debt_due',
      );
    },
  );
});
