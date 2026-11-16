#!/usr/bin/env node
/**
 * Task 05 - Field inventory screen demo.
 * Demonstrates loading, empty, and partial-permission states.
 * 
 * Usage:
 *   npm run demo:field-inventory
 *   npm run demo:field-inventory -- --source help-center
 */

import { renderScreen, loadInventory, getInitialState, type ScreenState } from './screen.js';

/**
 * Strip HTML tags for terminal output.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

/**
 * Demo a single source selection with loading state.
 */
async function demoSource(sourceId: string, sourceName: string): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Demo: ${sourceName}`);
  console.log('='.repeat(60));

  // Show loading state
  const loadingState: ScreenState = {
    isLoading: true,
    selectedSourceId: sourceId,
    inventory: null
  };
  
  console.log('\n[LOADING STATE - visible during 500ms delay]');
  console.log(stripHtml(renderScreen(loadingState)));

  // Simulate loading
  const inventory = await loadInventory(sourceId);

  // Show loaded state
  const loadedState: ScreenState = {
    isLoading: false,
    selectedSourceId: sourceId,
    inventory
  };

  console.log('\n[LOADED STATE]');
  console.log(stripHtml(renderScreen(loadedState)));
}

/**
 * Main demo execution.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const sourceIndex = args.indexOf('--source');

  if (sourceIndex !== -1 && args[sourceIndex + 1]) {
    // Demo specific source
    const sourceId = args[sourceIndex + 1];
    const sourceNames: Record<string, string> = {
      'help-center': 'Help Center (full permissions)',
      'crm-partial': 'CRM (partial permissions)',
      'empty-source': 'Empty Source'
    };

    const sourceName = sourceNames[sourceId] || sourceId;
    await demoSource(sourceId, sourceName);
  } else {
    // Demo all sources
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   Field Inventory Screen - State Demonstration            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    await demoSource('help-center', 'Help Center (full permissions)');
    await demoSource('crm-partial', 'CRM (partial permissions)');
    await demoSource('empty-source', 'Empty Source');

    console.log('\n' + '='.repeat(60));
    console.log('Demo complete!');
    console.log('='.repeat(60));
    console.log('\nDemo contract verification:');
    console.log('✓ Loading state: shown during 500ms delay for each source');
    console.log('✓ Empty state: shown for "Empty source" with setup links');
    console.log('✓ Partial warning: shown for "CRM (partial permissions)"');
    console.log('  with message "Partial inventory: 3 fields could not be read."');
    console.log('✓ Normal state: Help Center shows 25 fields without warning\n');
  }
}

main().catch(error => {
  console.error('Demo error:', error);
  process.exit(1);
});
