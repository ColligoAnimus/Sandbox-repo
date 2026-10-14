/**
 * Minimal fixture loader for repeat-handoff demo.
 * Created as part of task 02 since task 01 fixture loader was not present.
 */

export interface Turn {
  role: 'user' | 'assistant' | 'system';
  text: string;
}

export interface Scenario {
  id: string;
  name: string;
  turns: Turn[];
}

/**
 * Four scripted conversation scenarios demonstrating repeat handoff patterns.
 */
export const fixtures: Record<string, Scenario> = {
  repeat_loop: {
    id: 'repeat_loop',
    name: 'Repeat Loop',
    turns: [
      { role: 'user', text: 'Can you help me with this task?' },
      { role: 'assistant', text: 'I need more information to help you. What specifically do you need?' },
      { role: 'user', text: 'Just help me with the task.' },
      { role: 'assistant', text: 'I understand you need help, but could you please provide more details about what task you need assistance with?' },
      { role: 'user', text: 'The task I mentioned earlier.' },
      { role: 'assistant', text: 'I see we are going in circles. Let me hand this off to a human who can better understand your needs.' }
    ]
  },
  
  escalation_path: {
    id: 'escalation_path',
    name: 'Escalation Path',
    turns: [
      { role: 'user', text: 'I need to speak with a manager about my account.' },
      { role: 'assistant', text: 'I can help you with account issues. What seems to be the problem?' },
      { role: 'user', text: 'This is urgent and I need a manager now.' },
      { role: 'assistant', text: 'I understand this is urgent. Let me connect you with a supervisor who can assist you further.' }
    ]
  },
  
  clarification_needed: {
    id: 'clarification_needed',
    name: 'Clarification Needed',
    turns: [
      { role: 'user', text: 'Fix my settings.' },
      { role: 'assistant', text: 'I can help with settings. Which settings would you like to change?' },
      { role: 'user', text: 'The ones that are wrong.' },
      { role: 'assistant', text: 'Could you tell me which specific settings seem incorrect to you?' },
      { role: 'user', text: 'All of them.' },
      { role: 'assistant', text: 'This might require a more detailed discussion. Let me connect you with someone who can review your account settings comprehensively.' }
    ]
  },
  
  successful_handoff: {
    id: 'successful_handoff',
    name: 'Successful Handoff',
    turns: [
      { role: 'user', text: 'I would like to request a refund for my last purchase.' },
      { role: 'assistant', text: 'I can help with refund requests. Can you provide your order number?' },
      { role: 'user', text: 'Yes, it is ORDER-12345. The item arrived damaged.' },
      { role: 'assistant', text: 'I see. For damaged items, we need to process this through our quality assurance team. Let me transfer you to them with all the details you have provided.' }
    ]
  }
};

/**
 * Load a specific scenario by ID.
 * @param scenarioId - The ID of the scenario to load
 * @returns The scenario data
 * @throws Error if scenario ID is not found
 */
export function loadFixture(scenarioId: string): Scenario {
  const scenario = fixtures[scenarioId];
  if (!scenario) {
    const validIds = Object.keys(fixtures).join(', ');
    throw new Error(
      `Unknown scenario ID: "${scenarioId}"\nValid scenario IDs: ${validIds}`
    );
  }
  return scenario;
}

/**
 * Get all available scenario IDs.
 */
export function getScenarioIds(): string[] {
  return Object.keys(fixtures);
}
