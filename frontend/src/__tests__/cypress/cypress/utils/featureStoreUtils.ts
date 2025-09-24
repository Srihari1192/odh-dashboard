import { featureStoreGlobal } from '#~/__tests__/cypress/cypress/pages/featureStore/featureStoreGlobal';

/**
 * Extracts the total count from pagination toggle button
 * Uses the reusable pagination finder from featureStoreGlobal
 * @returns {Cypress.Chainable<number>} The total count from pagination
 */
export const getTotalCountFromPagination = (): Cypress.Chainable<number> => {
  return featureStoreGlobal
    .findPaginationToggle()
    .then(($el) => {
      const paginationText = $el.text().trim();
      const match = paginationText.match(/of\s+(\d+)/);
      if (match && match[1]) {
        const count = parseInt(match[1], 10);
        return cy.wrap<number>(count);
      }
      throw new Error(
        `Could not extract total count from pagination toggle text: ${paginationText}`,
      );
    })
    .then((count) => count);
};

/**
 * Asserts that the pagination shows the expected total count
 * @param {number} expectedCount - The expected total count
 * @returns {Cypress.Chainable<number>} Chainable that resolves to the actual count
 */
export const shouldHaveTotalCount = (expectedCount: number): Cypress.Chainable<number> => {
  return getTotalCountFromPagination().then((actualCount) => {
    expect(actualCount).to.equal(expectedCount);
    return cy.wrap(actualCount);
  });
};

/**
 * Handles interactive copy button hover and tooltip verification
 * Uses the reusable button finder from featureStoreGlobal
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The hover tooltip element
 */
export const shouldHaveInteractiveHoverTooltip = (): Cypress.Chainable<JQuery<HTMLElement>> => {
  featureStoreGlobal.findInteractiveCopyButton().trigger('mouseenter');
  featureStoreGlobal.findInteractiveCopyButton().trigger('focus');
  // Assert initial tooltip appears with correct text
  return cy
    .findByRole('tooltip', { timeout: 3000 })
    .should('be.visible')
    .should('contain.text', 'Copy to clipboard');
};

/**
 * Handles interactive copy button click and success tooltip verification
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The success tooltip element
 */
export const shouldHaveInteractiveClickSuccessTooltip = (): Cypress.Chainable<
  JQuery<HTMLElement>
> => {
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

  featureStoreGlobal.findInteractiveCopyButton().click();
  return cy
    .findByRole('tooltip', { timeout: 5000 })
    .should('be.visible')
    .should('contain.text', 'Successfully copied to clipboard!');
};
