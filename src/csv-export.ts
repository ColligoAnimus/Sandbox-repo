/**
 * CSV export functionality (Task 04)
 * Exports data source inventory to CSV format with audit trail
 */

import { DataSource, MOCK_WORKSPACE_ID } from './data-sources.js';

export interface ExportMetadata {
  sourceName: string;
  sourceId: string;
  timestamp: string;
  workspaceId: string;
  rowCount: number;
}

export interface AuditEntry {
  actor: string;
  source: string;
  timestamp: string;
  format: string;
}

/**
 * In-memory audit trail
 */
const auditTrail: AuditEntry[] = [];

/**
 * Generate CSV content from a data source
 */
export function exportCsv(
  dataSource: DataSource,
  meta: ExportMetadata
): string {
  const lines: string[] = [];
  
  // Add metadata header comments
  lines.push(`# Export Metadata`);
  lines.push(`# Source: ${meta.sourceName}`);
  lines.push(`# Workspace ID: ${meta.workspaceId}`);
  lines.push(`# Generated: ${meta.timestamp}`);
  lines.push(`# Row Count: ${meta.rowCount}`);
  lines.push('');
  
  // Add warning if present
  if (dataSource.hasWarning && dataSource.warningMessage) {
    lines.push(`# WARNING: ${dataSource.warningMessage}`);
    lines.push('');
  }
  
  // CSV header row
  lines.push('ID,Name,Status,Last Modified,Owner');
  
  // Data rows
  for (const row of dataSource.rows) {
    const csvRow = [
      escapeCSV(row.id),
      escapeCSV(row.name),
      escapeCSV(row.status),
      escapeCSV(row.lastModified),
      escapeCSV(row.owner)
    ].join(',');
    lines.push(csvRow);
  }
  
  return lines.join('\n');
}

/**
 * Escape a value for CSV format
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Record an export in the audit trail
 */
export function recordAudit(entry: AuditEntry): void {
  auditTrail.push(entry);
}

/**
 * Get all audit entries
 */
export function getAuditTrail(): readonly AuditEntry[] {
  return [...auditTrail];
}

/**
 * Get audit entry count
 */
export function getAuditCount(): number {
  return auditTrail.length;
}

/**
 * Clear audit trail (for testing)
 */
export function clearAuditTrail(): void {
  auditTrail.length = 0;
}

/**
 * Perform a complete export with audit recording
 */
export function performExport(
  dataSource: DataSource,
  actor: string = 'demo-admin'
): { csv: string; metadata: ExportMetadata; auditEntry: AuditEntry } {
  const timestamp = new Date().toISOString();
  
  const metadata: ExportMetadata = {
    sourceName: dataSource.name,
    sourceId: dataSource.id,
    timestamp,
    workspaceId: MOCK_WORKSPACE_ID,
    rowCount: dataSource.rows.length
  };
  
  const csv = exportCsv(dataSource, metadata);
  
  const auditEntry: AuditEntry = {
    actor,
    source: dataSource.name,
    timestamp,
    format: 'csv'
  };
  
  recordAudit(auditEntry);
  
  return { csv, metadata, auditEntry };
}
