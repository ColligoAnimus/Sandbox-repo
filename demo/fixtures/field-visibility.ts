/**
 * Deterministic mock fixture module for "What Fin can see" demo sources.
 * 
 * Describes four sample data sources with field visibility metadata:
 * - Help Center: 25 fields with mixed access and model flags
 * - Help Desk: 10 fields
 * - CRM with partial permissions: 9 readable + 3 unreadable fields
 * - Empty source: 0 fields
 * 
 * Created for task 01: fixture-only, no network calls, no secrets.
 */

export interface Field {
  name: string;
  accessStatus: 'readable' | 'restricted';
  sentToModel: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  fields: Field[];
  unreadableCount?: number;
}

/**
 * Mock field visibility fixtures for four demo sources.
 */
export const fixtures: Record<string, DataSource> = {
  'help-center': {
    id: 'help-center',
    name: 'Help Center',
    fields: [
      { name: 'article_id', accessStatus: 'readable', sentToModel: true },
      { name: 'article_title', accessStatus: 'readable', sentToModel: true },
      { name: 'article_body', accessStatus: 'readable', sentToModel: true },
      { name: 'category', accessStatus: 'readable', sentToModel: true },
      { name: 'subcategory', accessStatus: 'readable', sentToModel: false },
      { name: 'author_name', accessStatus: 'readable', sentToModel: false },
      { name: 'created_at', accessStatus: 'readable', sentToModel: false },
      { name: 'updated_at', accessStatus: 'readable', sentToModel: true },
      { name: 'published_status', accessStatus: 'readable', sentToModel: true },
      { name: 'view_count', accessStatus: 'readable', sentToModel: false },
      { name: 'helpful_votes', accessStatus: 'readable', sentToModel: false },
      { name: 'unhelpful_votes', accessStatus: 'readable', sentToModel: false },
      { name: 'tags', accessStatus: 'readable', sentToModel: true },
      { name: 'locale', accessStatus: 'readable', sentToModel: true },
      { name: 'seo_title', accessStatus: 'readable', sentToModel: false },
      { name: 'seo_description', accessStatus: 'readable', sentToModel: false },
      { name: 'internal_notes', accessStatus: 'readable', sentToModel: false },
      { name: 'featured', accessStatus: 'readable', sentToModel: true },
      { name: 'related_articles', accessStatus: 'readable', sentToModel: true },
      { name: 'attachments', accessStatus: 'readable', sentToModel: true },
      { name: 'version', accessStatus: 'readable', sentToModel: false },
      { name: 'changelog', accessStatus: 'readable', sentToModel: false },
      { name: 'approval_status', accessStatus: 'readable', sentToModel: false },
      { name: 'approved_by', accessStatus: 'readable', sentToModel: false },
      { name: 'scheduled_publish_date', accessStatus: 'readable', sentToModel: false }
    ]
  },

  'help-desk': {
    id: 'help-desk',
    name: 'Help Desk',
    fields: [
      { name: 'ticket_id', accessStatus: 'readable', sentToModel: true },
      { name: 'subject', accessStatus: 'readable', sentToModel: true },
      { name: 'description', accessStatus: 'readable', sentToModel: true },
      { name: 'status', accessStatus: 'readable', sentToModel: true },
      { name: 'priority', accessStatus: 'readable', sentToModel: true },
      { name: 'assignee', accessStatus: 'readable', sentToModel: false },
      { name: 'requester', accessStatus: 'readable', sentToModel: false },
      { name: 'created_at', accessStatus: 'readable', sentToModel: false },
      { name: 'updated_at', accessStatus: 'readable', sentToModel: false },
      { name: 'tags', accessStatus: 'readable', sentToModel: true }
    ]
  },

  'crm-partial': {
    id: 'crm-partial',
    name: 'CRM (Partial Permissions)',
    fields: [
      { name: 'account_id', accessStatus: 'readable', sentToModel: true },
      { name: 'account_name', accessStatus: 'readable', sentToModel: true },
      { name: 'industry', accessStatus: 'readable', sentToModel: true },
      { name: 'website', accessStatus: 'readable', sentToModel: false },
      { name: 'employee_count', accessStatus: 'readable', sentToModel: false },
      { name: 'plan_type', accessStatus: 'readable', sentToModel: true },
      { name: 'account_status', accessStatus: 'readable', sentToModel: true },
      { name: 'created_at', accessStatus: 'readable', sentToModel: false },
      { name: 'last_activity_date', accessStatus: 'readable', sentToModel: false }
    ],
    unreadableCount: 3
  },

  'empty-source': {
    id: 'empty-source',
    name: 'Empty Source',
    fields: []
  }
};

/**
 * Get field visibility data for a specific source by ID.
 * 
 * @param sourceId - The unique identifier for the data source
 * @returns The data source with field visibility metadata
 * @throws Error if the source ID is not found
 * 
 * @example
 * const helpCenter = getFieldsBySourceId('help-center');
 * console.log(`${helpCenter.name} has ${helpCenter.fields.length} fields`);
 * 
 * @example Edge case: CRM with partial permissions
 * const crm = getFieldsBySourceId('crm-partial');
 * console.log(`Readable: ${crm.fields.length}, Unreadable: ${crm.unreadableCount}`);
 * 
 * @example Edge case: Empty source
 * const empty = getFieldsBySourceId('empty-source');
 * console.log(`Fields: ${empty.fields.length}`); // 0
 */
export function getFieldsBySourceId(sourceId: string): DataSource {
  const source = fixtures[sourceId];
  
  if (!source) {
    const validIds = Object.keys(fixtures).join(', ');
    throw new Error(
      `Unknown source ID: "${sourceId}"\nValid source IDs: ${validIds}`
    );
  }
  
  return source;
}

/**
 * Get all available source IDs.
 */
export function getSourceIds(): string[] {
  return Object.keys(fixtures);
}

/**
 * Validate that all source IDs are unique.
 * This is a compile-time invariant check that should be run in tests.
 * 
 * @returns true if all source IDs are unique
 * @throws Error if duplicate source IDs are found
 */
export function validateUniqueSourceIds(): boolean {
  const ids = Object.keys(fixtures);
  const uniqueIds = new Set(ids);
  
  if (ids.length !== uniqueIds.size) {
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    throw new Error(
      `Duplicate source IDs found in fixtures: ${duplicates.join(', ')}`
    );
  }
  
  // Also verify that fixture keys match the id field
  for (const [key, source] of Object.entries(fixtures)) {
    if (key !== source.id) {
      throw new Error(
        `Source key "${key}" does not match source.id "${source.id}"`
      );
    }
  }
  
  return true;
}
