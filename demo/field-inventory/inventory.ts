/**
 * Task 03 - Field inventory builder.
 * Pure function that transforms fixture sources into sorted inventory rows with counts and flags.
 */

import { loadFieldSource, type Field } from './fixtures.js';

export interface InventoryRow {
  name: string;
  sentToModel: boolean;
}

export interface InventoryCounts {
  total: number;
  sentToModel: number;
  unreadable: number;
}

export interface InventoryResult {
  found: true;
  sourceId: string;
  sourceName: string;
  rows: InventoryRow[];
  counts: InventoryCounts;
}

export interface NotFoundResult {
  found: false;
  sourceId: string;
  error: string;
}

export type BuildInventoryResult = InventoryResult | NotFoundResult;

/**
 * Build inventory for a field source.
 * 
 * @param sourceId - The ID of the source to build inventory for
 * @returns Inventory with sorted rows and counts, or not-found result
 * 
 * @example
 * const result = buildInventory('help-center');
 * if (result.found) {
 *   console.log(`Total fields: ${result.counts.total}`);
 *   console.log(`Sent to model: ${result.counts.sentToModel}`);
 * }
 */
export function buildInventory(sourceId: string): BuildInventoryResult {
  const source = loadFieldSource(sourceId);
  
  if (!source) {
    return {
      found: false,
      sourceId,
      error: `Source not found: ${sourceId}`
    };
  }

  // Filter out unreadable fields and build rows
  const readableFields = source.fields.filter(field => !field.unreadable);
  
  // Sort rows alphabetically by field name
  const rows: InventoryRow[] = readableFields
    .map(field => ({
      name: field.name,
      sentToModel: field.sentToModel
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Calculate counts
  const total = source.fields.length;
  const sentToModel = source.fields.filter(f => f.sentToModel).length;
  const unreadable = source.fields.filter(f => f.unreadable).length;

  return {
    found: true,
    sourceId: source.id,
    sourceName: source.name,
    rows,
    counts: {
      total,
      sentToModel,
      unreadable
    }
  };
}
