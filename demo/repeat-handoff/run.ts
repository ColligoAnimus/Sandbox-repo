#!/usr/bin/env node
/**
 * Repeat-handoff demo entry point.
 * Loads fixture conversations and prints each turn for visibility.
 * 
 * Usage:
 *   npm run demo:repeat-handoff              # Print all scenarios
 *   npm run demo:repeat-handoff -- --scenario repeat_loop  # Print specific scenario
 */

import { fixtures, loadFixture, getScenarioIds, type Scenario } from './fixtures.js';

/**
 * Print a single conversation scenario.
 */
function printScenario(scenario: Scenario): void {
  console.log(`== ${scenario.id} ==`);
  console.log();
  
  for (const turn of scenario.turns) {
    console.log(`[${turn.role}] ${turn.text}`);
  }
  
  console.log();
}

/**
 * Main demo execution.
 */
function main(): void {
  const args = process.argv.slice(2);
  
  // Check for --scenario flag
  const scenarioIndex = args.indexOf('--scenario');
  if (scenarioIndex !== -1) {
    const scenarioId = args[scenarioIndex + 1];
    
    if (!scenarioId) {
      console.error('Error: --scenario flag requires a scenario ID argument');
      console.error(`Valid scenario IDs: ${getScenarioIds().join(', ')}`);
      process.exit(1);
    }
    
    try {
      const scenario = loadFixture(scenarioId);
      printScenario(scenario);
      process.exit(0);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error('Error: Unknown scenario');
      }
      process.exit(1);
    }
  }
  
  // Print all scenarios in fixture order
  const scenarioIds = getScenarioIds();
  for (const scenarioId of scenarioIds) {
    const scenario = fixtures[scenarioId];
    printScenario(scenario);
  }
}

// Run the demo
main();
