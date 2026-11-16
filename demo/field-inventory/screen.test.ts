/**
 * Task 05 - Tests for field inventory screen states.
 * Verifies loading, empty, and partial-permission states render correctly.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderScreen, getInitialState, type ScreenState } from './screen.js';
import { buildInventory } from './inventory.js';

describe('Field inventory screen states', () => {
  describe('loading state', () => {
    it('should render loading indicator when isLoading is true', () => {
      const state: ScreenState = {
        isLoading: true,
        selectedSourceId: 'help-center',
        inventory: null
      };

      const html = renderScreen(state);
      
      assert.ok(html.includes('Loading field inventory'), 'Should show loading message');
      assert.ok(html.includes('loading-state'), 'Should have loading-state class');
      assert.ok(!html.includes('<table'), 'Should not show table while loading');
    });

    it('should not show loading indicator when isLoading is false', () => {
      const inventory = buildInventory('help-center');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'help-center',
        inventory
      };

      const html = renderScreen(state);
      
      assert.ok(!html.includes('Loading field inventory'), 'Should not show loading message');
    });
  });

  describe('empty state', () => {
    it('should render empty state for empty-source', () => {
      const inventory = buildInventory('empty-source');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'empty-source',
        inventory
      };

      const html = renderScreen(state);
      
      assert.ok(html.includes('No fields available'), 'Should show empty message');
      assert.ok(html.includes('empty-state'), 'Should have empty-state class');
      assert.ok(html.includes('Configure data source'), 'Should show setup link');
      assert.ok(html.includes('Import fields'), 'Should show import link');
      assert.ok(html.includes('View documentation'), 'Should show documentation link');
      assert.ok(!html.includes('<table'), 'Should not show table for empty source');
    });

    it('should show setup links with placeholder hrefs', () => {
      const inventory = buildInventory('empty-source');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'empty-source',
        inventory
      };

      const html = renderScreen(state);
      
      // Setup links should be placeholders (#)
      const linkMatches = html.match(/href="#"/g);
      assert.ok(linkMatches && linkMatches.length >= 3, 'Should have at least 3 placeholder links');
    });
  });

  describe('partial permission warning', () => {
    it('should show warning banner for crm-partial with 3 unreadable fields', () => {
      const inventory = buildInventory('crm-partial');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'crm-partial',
        inventory
      };

      const html = renderScreen(state);
      
      assert.ok(html.includes('warning-banner'), 'Should have warning banner class');
      assert.ok(html.includes('Partial inventory'), 'Should show partial inventory message');
      assert.ok(html.includes('3 fields could not be read'), 'Should show count of 3 unreadable fields');
      assert.ok(html.includes('⚠️'), 'Should show warning icon');
    });

    it('should show table with readable fields for crm-partial', () => {
      const inventory = buildInventory('crm-partial');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'crm-partial',
        inventory
      };

      const html = renderScreen(state);
      
      assert.ok(html.includes('<table'), 'Should show table');
      assert.ok(html.includes('account_name'), 'Should show readable field');
      assert.ok(html.includes('contact_name'), 'Should show readable field');
      
      // Should not show unreadable fields in table
      assert.ok(!html.includes('corrupted_field_1'), 'Should not show corrupted field 1');
      assert.ok(!html.includes('corrupted_field_2'), 'Should not show corrupted field 2');
      assert.ok(!html.includes('corrupted_field_3'), 'Should not show corrupted field 3');
    });

    it('should not show warning for help-center (0 unreadable)', () => {
      const inventory = buildInventory('help-center');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'help-center',
        inventory
      };

      const html = renderScreen(state);
      
      assert.ok(!html.includes('warning-banner'), 'Should not have warning banner');
      assert.ok(!html.includes('Partial inventory'), 'Should not show partial inventory message');
      assert.ok(!html.includes('could not be read'), 'Should not show unreadable message');
    });
  });

  describe('normal state', () => {
    it('should render table for help-center without warnings', () => {
      const inventory = buildInventory('help-center');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'help-center',
        inventory
      };

      const html = renderScreen(state);
      
      assert.ok(html.includes('<table'), 'Should show table');
      assert.ok(!html.includes('warning-banner'), 'Should not show warning');
      assert.ok(!html.includes('empty-state'), 'Should not show empty state');
      assert.ok(html.includes('article_id'), 'Should show field from help-center');
    });

    it('should show counts summary', () => {
      const inventory = buildInventory('help-center');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'help-center',
        inventory
      };

      const html = renderScreen(state);
      
      assert.ok(html.includes('Total: 25'), 'Should show total count');
      assert.ok(html.includes('Sent to model: 11'), 'Should show sent to model count');
      assert.ok(html.includes('Unreadable: 0'), 'Should show unreadable count');
    });
  });

  describe('initial state', () => {
    it('should return state with no selection', () => {
      const state = getInitialState();
      
      assert.equal(state.isLoading, false);
      assert.equal(state.selectedSourceId, null);
      assert.equal(state.inventory, null);
    });

    it('should render message when no source selected', () => {
      const state = getInitialState();
      const html = renderScreen(state);
      
      assert.ok(html.includes('Select a data source'), 'Should show selection prompt');
      assert.ok(!html.includes('<table'), 'Should not show table');
      assert.ok(!html.includes('warning-banner'), 'Should not show warning');
    });
  });

  describe('source selector', () => {
    it('should include dropdown with all sources', () => {
      const state = getInitialState();
      const html = renderScreen(state);
      
      assert.ok(html.includes('Help Center'), 'Should list Help Center');
      assert.ok(html.includes('CRM (partial permissions)'), 'Should list CRM with partial permissions note');
      assert.ok(html.includes('Empty source'), 'Should list Empty source');
      assert.ok(html.includes('<select'), 'Should have select element');
    });

    it('should mark selected source in dropdown', () => {
      const inventory = buildInventory('crm-partial');
      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'crm-partial',
        inventory
      };

      const html = renderScreen(state);
      
      assert.ok(html.includes('value="crm-partial" selected'), 'Should mark crm-partial as selected');
    });
  });

  describe('warning count accuracy', () => {
    it('should match unreadable count from builder for crm-partial', () => {
      const inventory = buildInventory('crm-partial');
      
      if (!inventory.found) {
        throw new Error('Expected inventory to be found');
      }

      const state: ScreenState = {
        isLoading: false,
        selectedSourceId: 'crm-partial',
        inventory
      };

      const html = renderScreen(state);
      const expectedCount = inventory.counts.unreadable;
      
      assert.equal(expectedCount, 3, 'Builder should report 3 unreadable fields');
      assert.ok(html.includes(`${expectedCount} fields could not be read`), 
        'Warning should show count from builder');
    });
  });
});
