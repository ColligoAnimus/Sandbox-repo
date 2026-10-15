#!/usr/bin/env node
/**
 * Test runner for field-visibility fixtures.
 * Verifies the demo contract for "What Fin can see" data sources.
 * 
 * Usage:
 *   npm run test:field-visibility
 *   or: tsx demo/fixtures/field-visibility.test.ts
 */

import {
  getFieldsBySourceId,
  getSourceIds,
  validateUniqueSourceIds,
  type DataSource
} from './field-visibility.js';

/**
 * Test utilities
 */
let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name: string, fn: () => void): void {
  testCount++;
  try {
    fn();
    passCount++;
    console.log(`✓ ${name}`);
  } catch (error) {
    failCount++;
    console.error(`✗ ${name}`);
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
    }
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${expected}, got ${actual}`
    );
  }
}

function assertTrue(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Test suite
 */
function runTests(): void {
  console.log('Running field-visibility fixture tests...\n');

  // Test: Source IDs are unique
  test('Source IDs are unique', () => {
    const result = validateUniqueSourceIds();
    assertTrue(result, 'validateUniqueSourceIds should return true');
  });

  // Test: Help Center has 25 fields
  test('Help Center has 25 fields', () => {
    const source = getFieldsBySourceId('help-center');
    assertEqual(source.fields.length, 25, 'Help Center should have exactly 25 fields');
    assertEqual(source.name, 'Help Center', 'Help Center name should match');
  });

  // Test: Help Center fields have required properties
  test('Help Center fields have required properties', () => {
    const source = getFieldsBySourceId('help-center');
    const firstField = source.fields[0];
    assertTrue('name' in firstField, 'Field should have name property');
    assertTrue('accessStatus' in firstField, 'Field should have accessStatus property');
    assertTrue('sentToModel' in firstField, 'Field should have sentToModel property');
    assertTrue(
      firstField.accessStatus === 'readable' || firstField.accessStatus === 'restricted',
      'accessStatus should be readable or restricted'
    );
    assertTrue(
      typeof firstField.sentToModel === 'boolean',
      'sentToModel should be boolean'
    );
  });

  // Test: Help Desk has 10 fields
  test('Help Desk has 10 fields', () => {
    const source = getFieldsBySourceId('help-desk');
    assertEqual(source.fields.length, 10, 'Help Desk should have exactly 10 fields');
    assertEqual(source.name, 'Help Desk', 'Help Desk name should match');
  });

  // Test: CRM partial has 9 readable + 3 unreadable
  test('CRM partial has 9 readable + 3 unreadable fields', () => {
    const source = getFieldsBySourceId('crm-partial');
    assertEqual(source.fields.length, 9, 'CRM should have exactly 9 readable fields');
    assertEqual(source.unreadableCount, 3, 'CRM should have exactly 3 unreadable fields');
    assertEqual(source.name, 'CRM (Partial Permissions)', 'CRM name should match');
  });

  // Test: Empty source has 0 fields
  test('Empty source has 0 fields', () => {
    const source = getFieldsBySourceId('empty-source');
    assertEqual(source.fields.length, 0, 'Empty source should have 0 fields');
    assertEqual(source.name, 'Empty Source', 'Empty source name should match');
  });

  // Test: Unknown source ID throws error
  test('Unknown source ID throws clear error', () => {
    try {
      getFieldsBySourceId('unknown-source-id');
      throw new Error('Should have thrown an error for unknown source ID');
    } catch (error) {
      if (error instanceof Error) {
        assertTrue(
          error.message.includes('Unknown source ID'),
          'Error message should mention unknown source ID'
        );
        assertTrue(
          error.message.includes('Valid source IDs'),
          'Error message should list valid source IDs'
        );
      } else {
        throw new Error('Error should be an Error instance');
      }
    }
  });

  // Test: All sources are accessible
  test('All sources are accessible via getSourceIds', () => {
    const ids = getSourceIds();
    assertEqual(ids.length, 4, 'Should have exactly 4 source IDs');
    assertTrue(ids.includes('help-center'), 'Should include help-center');
    assertTrue(ids.includes('help-desk'), 'Should include help-desk');
    assertTrue(ids.includes('crm-partial'), 'Should include crm-partial');
    assertTrue(ids.includes('empty-source'), 'Should include empty-source');
  });

  // Test: Demo contract verification
  test('Demo contract: help-center returns 25 records with required structure', () => {
    const source = getFieldsBySourceId('help-center');
    assertEqual(source.fields.length, 25);
    
    // Verify each record has the required structure
    for (const field of source.fields) {
      assertTrue(typeof field.name === 'string', 'name should be string');
      assertTrue(
        field.accessStatus === 'readable' || field.accessStatus === 'restricted',
        'accessStatus should be readable or restricted'
      );
      assertTrue(typeof field.sentToModel === 'boolean', 'sentToModel should be boolean');
    }
  });

  test('Demo contract: crm-partial edge case', () => {
    const source = getFieldsBySourceId('crm-partial');
    assertEqual(source.fields.length, 9, 'Should return 9 readable records');
    assertEqual(source.unreadableCount, 3, 'Should indicate 3 unreadable');
  });

  test('Demo contract: empty-source edge case', () => {
    const source = getFieldsBySourceId('empty-source');
    assertEqual(source.fields.length, 0, 'Should return 0 records');
  });

  test('Demo contract: unknown ID returns clear not-found result', () => {
    let errorThrown = false;
    try {
      getFieldsBySourceId('unknown-id');
    } catch (error) {
      errorThrown = true;
      assertTrue(
        error instanceof Error && !error.message.includes('crash'),
        'Should throw clear error, not crash'
      );
    }
    assertTrue(errorThrown, 'Should throw an error for unknown ID');
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Tests: ${testCount} | Passed: ${passCount} | Failed: ${failCount}`);
  console.log('='.repeat(50));

  if (failCount > 0) {
    process.exit(1);
  }
}

// Run tests
runTests();
