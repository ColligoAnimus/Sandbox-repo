/**
 * Data source inventory for CSV export demo (Task 04)
 * Builds on task 03 inventory concept with actual data sources.
 */

export interface DataRow {
  id: string;
  name: string;
  status: string;
  lastModified: string;
  owner: string;
}

export interface DataSource {
  id: string;
  name: string;
  description: string;
  rows: DataRow[];
  hasWarning?: boolean;
  warningMessage?: string;
}

/**
 * Mock workspace ID for demo purposes
 */
export const MOCK_WORKSPACE_ID = 'ws_demo_12345';

/**
 * Generate mock data rows for a source
 */
function generateRows(sourceId: string, count: number): DataRow[] {
  const rows: DataRow[] = [];
  for (let i = 1; i <= count; i++) {
    rows.push({
      id: `${sourceId}_row_${i}`,
      name: `Item ${i}`,
      status: i % 3 === 0 ? 'Active' : i % 2 === 0 ? 'Pending' : 'Complete',
      lastModified: new Date(2026, 9, 15 - (i % 30)).toISOString(),
      owner: `user_${(i % 5) + 1}`
    });
  }
  return rows;
}

/**
 * Available data sources for export
 */
export const dataSources: DataSource[] = [
  {
    id: 'help_center',
    name: 'Help Center',
    description: 'Customer support articles and documentation',
    rows: generateRows('help_center', 25)
  },
  {
    id: 'crm_partial',
    name: 'CRM (partial permissions)',
    description: 'Customer relationship management data - limited access',
    rows: generateRows('crm_partial', 9),
    hasWarning: true,
    warningMessage: 'Limited permissions: only 9 of 50 records visible'
  },
  {
    id: 'inventory_empty',
    name: 'Inventory (Empty)',
    description: 'Product inventory - currently empty',
    rows: []
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Usage analytics and metrics',
    rows: generateRows('analytics', 42)
  }
];

/**
 * Get a data source by ID
 */
export function getDataSource(sourceId: string): DataSource | undefined {
  return dataSources.find(source => source.id === sourceId);
}

/**
 * Get all data source names for selection
 */
export function getDataSourceNames(): string[] {
  return dataSources.map(source => source.name);
}
