/**
 * Task 02 & 05 - Field inventory screen with loading, empty, and partial-permission states.
 * Renders inventory table with source selection and state handling.
 */

import { buildInventory, type BuildInventoryResult } from './inventory.js';

const LOADING_DELAY_MS = 500;

export interface ScreenState {
  isLoading: boolean;
  selectedSourceId: string | null;
  inventory: BuildInventoryResult | null;
}

/**
 * Simulate loading delay to show loading state.
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Render the loading state.
 */
function renderLoadingState(): string {
  return `<div class="loading-state">
    <p>Loading field inventory...</p>
  </div>`;
}

/**
 * Render the empty state with setup links.
 */
function renderEmptyState(): string {
  return `<div class="empty-state">
    <h3>No fields available</h3>
    <p>This data source has no fields configured yet.</p>
    <div class="setup-links">
      <a href="#">Configure data source</a>
      <span> · </span>
      <a href="#">Import fields</a>
      <span> · </span>
      <a href="#">View documentation</a>
    </div>
  </div>`;
}

/**
 * Render partial permission warning banner.
 */
function renderPartialWarning(unreadableCount: number): string {
  const plural = unreadableCount === 1 ? 'field' : 'fields';
  return `<div class="warning-banner">
    ⚠️ Partial inventory: ${unreadableCount} ${plural} could not be read.
  </div>`;
}

/**
 * Render the inventory table.
 */
function renderInventoryTable(inventory: BuildInventoryResult): string {
  if (!inventory.found) {
    return `<div class="error-state">
      <p>Error: ${inventory.error}</p>
    </div>`;
  }

  let html = '';

  // Show partial permission warning if needed
  if (inventory.counts.unreadable > 0) {
    html += renderPartialWarning(inventory.counts.unreadable);
  }

  // Show empty state if no fields
  if (inventory.rows.length === 0) {
    html += renderEmptyState();
    return html;
  }

  // Render counts summary
  html += `<div class="inventory-summary">
    <p>
      Total: ${inventory.counts.total} · 
      Sent to model: ${inventory.counts.sentToModel} · 
      Unreadable: ${inventory.counts.unreadable}
    </p>
  </div>`;

  // Render table
  html += `<table class="inventory-table">
    <thead>
      <tr>
        <th>Field Name</th>
        <th>Sent to Model</th>
      </tr>
    </thead>
    <tbody>`;

  for (const row of inventory.rows) {
    const sentIcon = row.sentToModel ? '✓' : '✗';
    html += `<tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${sentIcon}</td>
    </tr>`;
  }

  html += `</tbody>
  </table>`;

  return html;
}

/**
 * Escape HTML to prevent injection.
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Render the complete screen with source selection.
 */
export function renderScreen(state: ScreenState): string {
  let html = `<div class="field-inventory-screen">
    <h2>Field Inventory Viewer</h2>
    
    <div class="source-selector">
      <label for="source-select">Select data source:</label>
      <select id="source-select">
        <option value="">-- Choose a source --</option>
        <option value="help-center" ${state.selectedSourceId === 'help-center' ? 'selected' : ''}>Help Center</option>
        <option value="crm-partial" ${state.selectedSourceId === 'crm-partial' ? 'selected' : ''}>CRM (partial permissions)</option>
        <option value="empty-source" ${state.selectedSourceId === 'empty-source' ? 'selected' : ''}>Empty source</option>
      </select>
    </div>
    
    <div class="inventory-content">`;

  if (state.isLoading) {
    html += renderLoadingState();
  } else if (state.inventory) {
    html += renderInventoryTable(state.inventory);
  } else {
    html += '<p class="no-selection">Select a data source to view its field inventory.</p>';
  }

  html += `</div>
  </div>`;

  return html;
}

/**
 * Load inventory for a source with simulated loading delay.
 */
export async function loadInventory(sourceId: string): Promise<BuildInventoryResult> {
  await delay(LOADING_DELAY_MS);
  return buildInventory(sourceId);
}

/**
 * Get initial screen state.
 */
export function getInitialState(): ScreenState {
  return {
    isLoading: false,
    selectedSourceId: null,
    inventory: null
  };
}
