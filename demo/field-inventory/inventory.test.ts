/**
 * Task 03 - Unit tests for field inventory builder.
 * Tests cover demo contract cases: help-center, crm-partial, empty-source, and unknown ID.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildInventory } from './inventory.js';

describe('buildInventory', () => {
  describe('help-center source', () => {
    it('should return total 25 fields', () => {
      const result = buildInventory('help-center');
      assert.equal(result.found, true);
      if (result.found) {
        assert.equal(result.counts.total, 25);
      }
    });

    it('should have correct sentToModel count matching fixture flags', () => {
      const result = buildInventory('help-center');
      assert.equal(result.found, true);
      if (result.found) {
        // Count sentToModel fields from fixture: 11 fields have sentToModel: true
        assert.equal(result.counts.sentToModel, 11);
      }
    });

    it('should have zero unreadable fields', () => {
      const result = buildInventory('help-center');
      assert.equal(result.found, true);
      if (result.found) {
        assert.equal(result.counts.unreadable, 0);
      }
    });

    it('should return rows sorted alphabetically by field name', () => {
      const result = buildInventory('help-center');
      assert.equal(result.found, true);
      if (result.found) {
        const names = result.rows.map(r => r.name);
        const sortedNames = [...names].sort();
        assert.deepEqual(names, sortedNames);
      }
    });

    it('should include all readable fields in rows', () => {
      const result = buildInventory('help-center');
      assert.equal(result.found, true);
      if (result.found) {
        assert.equal(result.rows.length, 25);
      }
    });
  });

  describe('crm-partial source', () => {
    it('should return total 9 fields', () => {
      const result = buildInventory('crm-partial');
      assert.equal(result.found, true);
      if (result.found) {
        assert.equal(result.counts.total, 9);
      }
    });

    it('should have 3 unreadable fields', () => {
      const result = buildInventory('crm-partial');
      assert.equal(result.found, true);
      if (result.found) {
        assert.equal(result.counts.unreadable, 3);
      }
    });

    it('should exclude unreadable fields from rows', () => {
      const result = buildInventory('crm-partial');
      assert.equal(result.found, true);
      if (result.found) {
        // 9 total - 3 unreadable = 6 readable fields in rows
        assert.equal(result.rows.length, 6);
        
        // Verify no unreadable fields in rows
        const rowNames = result.rows.map(r => r.name);
        assert.ok(!rowNames.includes('corrupted_field_1'));
        assert.ok(!rowNames.includes('corrupted_field_2'));
        assert.ok(!rowNames.includes('corrupted_field_3'));
      }
    });

    it('should return rows sorted alphabetically', () => {
      const result = buildInventory('crm-partial');
      assert.equal(result.found, true);
      if (result.found) {
        const names = result.rows.map(r => r.name);
        const sortedNames = [...names].sort();
        assert.deepEqual(names, sortedNames);
      }
    });
  });

  describe('empty-source', () => {
    it('should return total 0 fields', () => {
      const result = buildInventory('empty-source');
      assert.equal(result.found, true);
      if (result.found) {
        assert.equal(result.counts.total, 0);
      }
    });

    it('should return empty rows array', () => {
      const result = buildInventory('empty-source');
      assert.equal(result.found, true);
      if (result.found) {
        assert.equal(result.rows.length, 0);
        assert.deepEqual(result.rows, []);
      }
    });

    it('should have zero counts for all metrics', () => {
      const result = buildInventory('empty-source');
      assert.equal(result.found, true);
      if (result.found) {
        assert.equal(result.counts.total, 0);
        assert.equal(result.counts.sentToModel, 0);
        assert.equal(result.counts.unreadable, 0);
      }
    });
  });

  describe('unknown source ID', () => {
    it('should return not-found result', () => {
      const result = buildInventory('non-existent-source');
      assert.equal(result.found, false);
      if (!result.found) {
        assert.equal(result.sourceId, 'non-existent-source');
        assert.ok(result.error.includes('not found'));
      }
    });

    it('should include the source ID in error message', () => {
      const result = buildInventory('unknown-id');
      assert.equal(result.found, false);
      if (!result.found) {
        assert.ok(result.error.includes('unknown-id'));
      }
    });
  });

  describe('sentToModel flag accuracy', () => {
    it('should correctly reflect fixture flags in rows', () => {
      const result = buildInventory('help-center');
      assert.equal(result.found, true);
      if (result.found) {
        // Verify specific fields have correct sentToModel flags
        const articleId = result.rows.find(r => r.name === 'article_id');
        const authorEmail = result.rows.find(r => r.name === 'author_email');
        
        assert.ok(articleId, 'article_id should exist in rows');
        assert.ok(authorEmail, 'author_email should exist in rows');
        
        if (articleId && authorEmail) {
          assert.equal(articleId.sentToModel, true);
          assert.equal(authorEmail.sentToModel, false);
        }
      }
    });
  });
});
