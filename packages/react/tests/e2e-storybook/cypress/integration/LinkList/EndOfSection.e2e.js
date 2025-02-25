/**
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import getCssPropertyForRule from '../../utils/get-css-property-for-rule';

/**
 * Sets the correct path
 *
 * @type {string} path of component
 * @private
 */
const _path = 'iframe.html?id=components-link-list--end-of-section';

/**
 * Collection of tests for the component
 *
 * @function checkComponentLoad Asserts that each list item loads body copy and one clickable link
 * @function checkVerticalAlignment Asserts that each list item is positioned directly below its previous sibling
 * @function checkHoverState Asserts that list items have a CSS rule that sets the background color on hover
 * @function checkCTATypes Asserts that the CTA icon is set correctly for each type
 * @private
 */
const _tests = {
  checkComponentLoad: () => {
    cy.get('.bx--link-list').then(([list]) => {
      const items = list.querySelectorAll('.bx--link-list__list__CTA');
      items.forEach(item => {
        const bodyCopy = item.textContent.replaceAll(/(\\n)|\s/g, '');
        expect(bodyCopy).to.not.be.eq('');

        const links = item.querySelectorAll('a');
        const icons = item.querySelectorAll('a svg');
        expect(links.length).to.be.equal(1);
        expect(links[0]).to.be.visible;
        expect(icons.length).to.be.equal(1);
      });
    });
  },
  checkVerticalAlignment: () => {
    let previous, window;
    cy.window()
      .then(win => (window = win))
      .get('.bx--link-list__list__CTA')
      .each(([card], i) => {
        if (i !== 0) {
          const cardBox = card.getBoundingClientRect();
          const prevBox = previous.getBoundingClientRect();
          const cardStyles = window.getComputedStyle(card);
          const prevStyles = window.getComputedStyle(previous);

          expect(cardBox.top).to.be.eq(
            prevBox.bottom +
              parseInt(prevStyles.marginBottom) +
              parseInt(cardStyles.marginTop)
          );
        }
        previous = card;
      });
  },
  checkHoverState: () => {
    cy.get('.bx--link-list .bx--link-list__list__CTA').then(([card]) => {
      const sheets = card.ownerDocument.styleSheets;

      if (sheets) {
        const hover = getCssPropertyForRule(
          '.bx--link-list__list--vertical-end .bx--link-list__list__CTA:hover',
          'background',
          sheets
        );

        expect(hover).to.be.eq('var(--cds-hover-ui, #e5e5e5)');
      }
    });
  },
  checkCTATypes: () => {
    const expected = {
      local:
        'M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z',
      jump:
        'M24.59 16.59L17 24.17 17 4 15 4 15 24.17 7.41 16.59 6 18 16 28 26 18 24.59 16.59z',
      external:
        'M26,28H6a2.0027,2.0027,0,0,1-2-2V6A2.0027,2.0027,0,0,1,6,4H16V6H6V26H26V16h2V26A2.0027,2.0027,0,0,1,26,28Z',
      download:
        'M26 24v4H6V24H4v4H4a2 2 0 002 2H26a2 2 0 002-2h0V24zM26 14L24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14z',
      video:
        'M11,23a1,1,0,0,1-1-1V10a1,1,0,0,1,1.4473-.8945l12,6a1,1,0,0,1,0,1.789l-12,6A1.001,1.001,0,0,1,11,23Zm1-11.3821v8.7642L20.7642,16Z',
    };

    const ctaPrefix = 'bx--link-list__list--';

    cy.get('.bx--link-list__list__CTA').each($item => {
      const thisType = $item
        .attr('class')
        .split(' ')
        .filter(className => className.indexOf(ctaPrefix) !== -1)
        .pop()
        .substr(ctaPrefix.length);

      cy.get($item)
        .find('a.bx--link path')
        .then(path => {
          expect(path.attr('d')).to.be.eq(expected[thisType]);
        });
    });
  },
};

describe('LinkList | default (desktop)', () => {
  beforeEach(() => {
    cy.mockKaltura();
    cy.viewport(1280, 780);
    cy.visit(`/${_path}`).wait(1000);
  });

  it('should load items with text and link', _tests.checkComponentLoad);
  it('should have a vertical layout', _tests.checkVerticalAlignment);
  it('should change styles on hover', _tests.checkHoverState);
  it('should render different CTA types', _tests.checkCTATypes);
});

describe('LinkList | default (mobile)', () => {
  beforeEach(() => {
    cy.mockKaltura();
    cy.viewport(325, 780);
    cy.visit(`/${_path}`).wait(1000);
  });

  it('should load items with text and link', _tests.checkComponentLoad);
  it('should have a vertical layout', _tests.checkVerticalAlignment);
  it('should change styles on hover', _tests.checkHoverState);
  it('should render different CTA types', _tests.checkCTATypes);
});
