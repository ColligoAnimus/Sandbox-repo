#!/usr/bin/env node
/**
 * Demo script for field-visibility fixtures.
 * Shows fixture data and field counts for each source.
 * 
 * Usage:
 *   npm run demo:field-visibility
 *   npm run demo:field-visibility -- --source help-center
 */

import {
  getFieldsBySourceId,
  getSourceIds,
  type DataSource
} from './field-visibility.js';

/**
 * Print field visibility information for a single data source.
 */
function printSource(source: DataSource): void {
  console.log(`\n== ${source.name} (${source.id}) ==`);
  console.log(`Readable fields: ${source.fields.length}`);
  
  if (source.unreadableCount) {
    console.log(`Unreadable fields: ${source.unreadableCount}`);
    console.log(`Total fields: ${source.fields.length + source.unreadableCount}`);
  }
  
  if (source.fields.length > 0) {
    console.log('\nFields:');
    for (const field of source.fields) {
      const modelFlag = field.sentToModel ? '✓ sent to model' : '  not sent';
      const accessFlag = field.accessStatus === 'readable' ? '✓ readable' : '✗ restricted';
      console.log(`  - ${field.name.padEnd(25)} [${accessFlag}] [${modelFlag}]`);
    }
  } else {
    console.log('\n(No fields)');
  }
  
  console.log();
}

/**
 * Main demo execution.
 */
function main(): void {
  const args = process.argv.slice(2);
  
  // Check for --source flag
  const sourceIndex = args.indexOf('--source');
  if (sourceIndex !== -1) {
    const sourceId = args[sourceIndex + 1];
    
    if (!sourceId) {
      console.error('Error: --source flag requires a source ID argument');
      console.error(`Valid source IDs: ${getSourceIds().join(', ')}`);
      process.exit(1);
    }
    
    try {
      const source = getFieldsBySourceId(sourceId);
      printSource(source);
      process.exit(0);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error('Error: Unknown source');
      }
      process.exit(1);
    }
  }
  
  // Print all sources
  console.log('Field Visibility Demo - All Sources');
  console.log('=====================================');
  
  const sourceIds = getSourceIds();
  for (const sourceId of sourceIds) {
    const source = getFieldsBySourceId(sourceId);
    printSource(source);
  }
  
  // Summary
  console.log('Summary');
  console.log('-------');
  for (const sourceId of sourceIds) {
    const source = getFieldsBySourceId(sourceId);
    const total = source.fields.length + (source.unreadableCount || 0);
    console.log(`${source.name}: ${total} total fields (${source.fields.length} readable)`);
  }
  console.log();
}

// Run the demo
main();
