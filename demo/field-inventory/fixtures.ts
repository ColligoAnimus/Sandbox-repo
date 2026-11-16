/**
 * Task 01 - Field inventory fixture data.
 * Mock data sources with field definitions and sent-to-model flags.
 */

export interface Field {
  name: string;
  sentToModel: boolean;
  unreadable?: boolean;
}

export interface FieldSource {
  id: string;
  name: string;
  fields: Field[];
}

/**
 * Mock field data sources for inventory demo.
 * Each source represents a collection of fields with metadata flags.
 */
export const fieldSources: Record<string, FieldSource> = {
  'help-center': {
    id: 'help-center',
    name: 'Help Center',
    fields: [
      { name: 'article_id', sentToModel: true },
      { name: 'article_title', sentToModel: true },
      { name: 'article_body', sentToModel: true },
      { name: 'author_email', sentToModel: false },
      { name: 'author_id', sentToModel: false },
      { name: 'author_name', sentToModel: true },
      { name: 'category', sentToModel: true },
      { name: 'created_at', sentToModel: false },
      { name: 'excerpt', sentToModel: true },
      { name: 'featured_image_url', sentToModel: false },
      { name: 'internal_notes', sentToModel: false },
      { name: 'keywords', sentToModel: true },
      { name: 'last_modified_at', sentToModel: false },
      { name: 'last_modified_by', sentToModel: false },
      { name: 'metadata', sentToModel: false },
      { name: 'published_at', sentToModel: true },
      { name: 'related_articles', sentToModel: true },
      { name: 'search_terms', sentToModel: true },
      { name: 'slug', sentToModel: false },
      { name: 'status', sentToModel: false },
      { name: 'tags', sentToModel: true },
      { name: 'updated_at', sentToModel: false },
      { name: 'view_count', sentToModel: false },
      { name: 'votes_down', sentToModel: false },
      { name: 'votes_up', sentToModel: false }
    ]
  },

  'crm-partial': {
    id: 'crm-partial',
    name: 'CRM Partial',
    fields: [
      { name: 'account_name', sentToModel: true },
      { name: 'contact_email', sentToModel: false },
      { name: 'contact_name', sentToModel: true },
      { name: 'corrupted_field_1', sentToModel: false, unreadable: true },
      { name: 'corrupted_field_2', sentToModel: false, unreadable: true },
      { name: 'corrupted_field_3', sentToModel: false, unreadable: true },
      { name: 'deal_size', sentToModel: true },
      { name: 'industry', sentToModel: true },
      { name: 'last_contact_date', sentToModel: false }
    ]
  },

  'empty-source': {
    id: 'empty-source',
    name: 'Empty Source',
    fields: []
  }
};

/**
 * Load a field source by ID.
 * @param sourceId - The ID of the source to load
 * @returns The source data or null if not found
 */
export function loadFieldSource(sourceId: string): FieldSource | null {
  return fieldSources[sourceId] || null;
}

/**
 * Get all available source IDs.
 */
export function getSourceIds(): string[] {
  return Object.keys(fieldSources);
}
