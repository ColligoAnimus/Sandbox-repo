/**
 * Tests for CSV export functionality (Task 04)
 */

import { dataSources, getDataSource, MOCK_WORKSPACE_ID } from './data-sources.js';
import { 
  performExport, 
  getAuditTrail, 
  getAuditCount,
  clearAuditTrail 
} from './csv-export.js';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function testDataSources(): void {
  console.log('Testing data sources...');
  
  assert(dataSources.length > 0, 'Should have at least one data source');
  
  const helpCenter = getDataSource('help_center');
  assert(helpCenter !== undefined, 'Help Center source should exist');
  assert(helpCenter.rows.length === 25, 'Help Center should have 25 rows');
  
  const crm = getDataSource('crm_partial');
  assert(crm !== undefined, 'CRM source should exist');
  assert(crm.rows.length === 9, 'CRM should have 9 rows');
  assert(crm.hasWarning === true, 'CRM should have a warning');
  
  const empty = getDataSource('inventory_empty');
  assert(empty !== undefined, 'Empty inventory should exist');
  assert(empty.rows.length === 0, 'Empty inventory should have 0 rows');
  
  console.log('✅ Data sources test passed');
}

function testCsvExport(): void {
  console.log('Testing CSV export...');
  
  clearAuditTrail();
  
  const helpCenter = getDataSource('help_center')!;
  const result = performExport(helpCenter, 'demo-admin');
  
  // Check CSV content
  assert(result.csv.includes('# Export Metadata'), 'CSV should include metadata header');
  assert(result.csv.includes('# Source: Help Center'), 'CSV should include source name');
  assert(result.csv.includes(`# Workspace ID: ${MOCK_WORKSPACE_ID}`), 'CSV should include workspace ID');
  assert(result.csv.includes('ID,Name,Status,Last Modified,Owner'), 'CSV should include header row');
  
  // Count CSV rows (excluding comments and header)
  const lines = result.csv.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
  const dataLines = lines.slice(1); // Skip header
  assert(dataLines.length === 25, 'CSV should have 25 data rows for Help Center');
  
  // Check metadata
  assert(result.metadata.sourceName === 'Help Center', 'Metadata should have correct source name');
  assert(result.metadata.rowCount === 25, 'Metadata should have correct row count');
  assert(result.metadata.workspaceId === MOCK_WORKSPACE_ID, 'Metadata should have correct workspace ID');
  
  console.log('✅ CSV export test passed');
}

function testAuditTrail(): void {
  console.log('Testing audit trail...');
  
  clearAuditTrail();
  
  assert(getAuditCount() === 0, 'Audit trail should start empty');
  
  const helpCenter = getDataSource('help_center')!;
  const result1 = performExport(helpCenter, 'demo-admin');
  
  assert(getAuditCount() === 1, 'Audit trail should have 1 entry after first export');
  assert(result1.auditEntry.actor === 'demo-admin', 'Audit entry should record correct actor');
  assert(result1.auditEntry.source === 'Help Center', 'Audit entry should record correct source');
  assert(result1.auditEntry.format === 'csv', 'Audit entry should record correct format');
  
  const crm = getDataSource('crm_partial')!;
  performExport(crm, 'demo-admin');
  
  assert(getAuditCount() === 2, 'Audit trail should have 2 entries after second export');
  
  const trail = getAuditTrail();
  assert(trail.length === 2, 'Audit trail should return all entries');
  assert(trail[0].source === 'Help Center', 'First entry should be Help Center');
  assert(trail[1].source === 'CRM (partial permissions)', 'Second entry should be CRM');
  
  console.log('✅ Audit trail test passed');
}

function testEmptySourceExport(): void {
  console.log('Testing empty source export...');
  
  clearAuditTrail();
  
  const empty = getDataSource('inventory_empty')!;
  const result = performExport(empty, 'demo-admin');
  
  // Should still create CSV with header
  assert(result.csv.includes('ID,Name,Status,Last Modified,Owner'), 'Empty export should still have header');
  
  const lines = result.csv.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
  const dataLines = lines.slice(1); // Skip header
  assert(dataLines.length === 0, 'Empty source should have 0 data rows');
  
  // Should still record audit entry
  assert(getAuditCount() === 1, 'Empty export should still create audit entry');
  assert(result.auditEntry.source === 'Inventory (Empty)', 'Audit should record empty source');
  
  console.log('✅ Empty source export test passed');
}

function testCrmPartialExport(): void {
  console.log('Testing CRM partial permissions export...');
  
  clearAuditTrail();
  
  const crm = getDataSource('crm_partial')!;
  const result = performExport(crm, 'demo-admin');
  
  // Should include warning in CSV
  assert(result.csv.includes('# WARNING:'), 'CRM export should include warning');
  assert(result.csv.includes('Limited permissions'), 'Warning should mention limited permissions');
  
  // Should export only 9 rows
  const lines = result.csv.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
  const dataLines = lines.slice(1);
  assert(dataLines.length === 9, 'CRM export should have exactly 9 rows');
  
  assert(result.metadata.rowCount === 9, 'Metadata should reflect 9 rows');
  
  console.log('✅ CRM partial export test passed');
}

function testRowCountMatchesTable(): void {
  console.log('Testing CSV row count matches table row count...');
  
  for (const source of dataSources) {
    const result = performExport(source, 'test-actor');
    
    const lines = result.csv.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
    const dataLines = lines.slice(1); // Skip header
    
    assert(
      dataLines.length === source.rows.length,
      `CSV row count (${dataLines.length}) should match table row count (${source.rows.length}) for ${source.name}`
    );
  }
  
  console.log('✅ Row count matching test passed');
}

function runAllTests(): void {
  console.log('');
  console.log('========================================');
  console.log('Running CSV Export Tests (Task 04)');
  console.log('========================================');
  console.log('');
  
  try {
    testDataSources();
    testCsvExport();
    testAuditTrail();
    testEmptySourceExport();
    testCrmPartialExport();
    testRowCountMatchesTable();
    
    console.log('');
    console.log('========================================');
    console.log('✅ All tests passed!');
    console.log('========================================');
    console.log('');
    process.exit(0);
  } catch (error) {
    console.log('');
    console.log('========================================');
    console.log('❌ Test failed:');
    console.error(error instanceof Error ? error.message : String(error));
    console.log('========================================');
    console.log('');
    process.exit(1);
  }
}

runAllTests();
