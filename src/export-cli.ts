#!/usr/bin/env node
/**
 * CLI interface for CSV export (Task 04)
 * Provides command-line access to export functionality
 */

import * as fs from 'fs';
import * as path from 'path';
import { dataSources, getDataSource } from './data-sources.js';
import { performExport, getAuditTrail, getAuditCount } from './csv-export.js';

function printUsage(): void {
  console.log('Usage:');
  console.log('  npm run export:cli -- list              # List available data sources');
  console.log('  npm run export:cli -- export <source>   # Export a data source to CSV');
  console.log('  npm run export:cli -- audit             # Show audit trail');
  console.log('');
  console.log('Available sources:');
  for (const source of dataSources) {
    console.log(`  - ${source.name} (${source.rows.length} rows)`);
  }
}

function listSources(): void {
  console.log('Available Data Sources:');
  console.log('');
  for (const source of dataSources) {
    console.log(`📊 ${source.name}`);
    console.log(`   ID: ${source.id}`);
    console.log(`   Description: ${source.description}`);
    console.log(`   Rows: ${source.rows.length}`);
    if (source.hasWarning) {
      console.log(`   ⚠️  ${source.warningMessage}`);
    }
    console.log('');
  }
}

function exportSource(sourceName: string): void {
  const source = dataSources.find(
    s => s.name.toLowerCase() === sourceName.toLowerCase() || 
         s.id === sourceName
  );
  
  if (!source) {
    console.error(`Error: Source "${sourceName}" not found`);
    console.error('');
    printUsage();
    process.exit(1);
  }
  
  console.log(`Exporting: ${source.name}`);
  if (source.hasWarning) {
    console.log(`⚠️  ${source.warningMessage}`);
  }
  
  const result = performExport(source, 'demo-admin');
  
  // Write CSV to file
  const outputDir = path.join(process.cwd(), 'exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filename = `${source.id}_${Date.now()}.csv`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, result.csv, 'utf-8');
  
  console.log('');
  console.log('✅ Export completed:');
  console.log(`   File: ${filepath}`);
  console.log(`   Rows exported: ${result.metadata.rowCount}`);
  console.log(`   Workspace ID: ${result.metadata.workspaceId}`);
  console.log(`   Timestamp: ${result.metadata.timestamp}`);
  console.log('');
  console.log('📝 Audit entry recorded:');
  console.log(`   Actor: ${result.auditEntry.actor}`);
  console.log(`   Source: ${result.auditEntry.source}`);
  console.log(`   Format: ${result.auditEntry.format}`);
  console.log(`   Total audit entries: ${getAuditCount()}`);
}

function showAudit(): void {
  const trail = getAuditTrail();
  
  if (trail.length === 0) {
    console.log('No audit entries recorded yet.');
    return;
  }
  
  console.log(`Audit Trail (${trail.length} entries):`);
  console.log('');
  
  for (let i = 0; i < trail.length; i++) {
    const entry = trail[i];
    console.log(`${i + 1}. ${entry.source}`);
    console.log(`   Actor: ${entry.actor}`);
    console.log(`   Format: ${entry.format}`);
    console.log(`   Timestamp: ${entry.timestamp}`);
    console.log('');
  }
}

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'list':
      listSources();
      break;
    
    case 'export':
      if (args.length < 2) {
        console.error('Error: export command requires a source name');
        console.error('');
        printUsage();
        process.exit(1);
      }
      exportSource(args[1]);
      break;
    
    case 'audit':
      showAudit();
      break;
    
    default:
      console.error(`Error: Unknown command "${command}"`);
      console.error('');
      printUsage();
      process.exit(1);
  }
}

main();
