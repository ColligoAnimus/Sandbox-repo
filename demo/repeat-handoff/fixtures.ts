import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export interface Turn {
  role: 'user' | 'fin';
  text: string;
  turnId: string;
}

export interface FailureSignal {
  repeatLoop: boolean;
  declined: boolean;
  explicitHumanRequest: boolean;
  supportUnavailable: boolean;
}

export interface Conversation {
  id: string;
  turns: Turn[];
  failureSignal: FailureSignal;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load and validate synthetic Fin conversation fixtures.
 * @throws {Error} If required fields are missing or invalid
 */
export function loadConversations(): Conversation[] {
  const fixturesPath = join(__dirname, 'fixtures', 'conversations.json');
  const rawData = readFileSync(fixturesPath, 'utf-8');
  const data = JSON.parse(rawData);

  if (!Array.isArray(data)) {
    throw new Error('Fixtures file must contain an array of conversations');
  }

  const conversations: Conversation[] = [];

  for (let i = 0; i < data.length; i++) {
    const conv = data[i];

    // Validate required conversation fields
    if (!conv.id) {
      throw new Error(`Conversation at index ${i} is missing required field: id`);
    }

    if (!Array.isArray(conv.turns)) {
      throw new Error(`Conversation "${conv.id}" is missing required field: turns (must be an array)`);
    }

    if (!conv.failureSignal) {
      throw new Error(`Conversation "${conv.id}" is missing required field: failureSignal`);
    }

    // Validate turns
    for (let j = 0; j < conv.turns.length; j++) {
      const turn = conv.turns[j];

      if (!turn.role) {
        throw new Error(`Conversation "${conv.id}", turn ${j} is missing required field: role`);
      }

      if (!turn.text) {
        throw new Error(`Conversation "${conv.id}", turn ${j} is missing required field: text`);
      }

      if (!turn.turnId) {
        throw new Error(`Conversation "${conv.id}", turn ${j} is missing required field: turnId`);
      }

      if (turn.role !== 'user' && turn.role !== 'fin') {
        throw new Error(`Conversation "${conv.id}", turn ${j} has invalid role: ${turn.role} (must be "user" or "fin")`);
      }
    }

    // Validate failureSignal fields
    const requiredSignals = ['repeatLoop', 'declined', 'explicitHumanRequest', 'supportUnavailable'];
    for (const signal of requiredSignals) {
      if (typeof conv.failureSignal[signal] !== 'boolean') {
        throw new Error(`Conversation "${conv.id}" failureSignal is missing required boolean field: ${signal}`);
      }
    }

    conversations.push({
      id: conv.id,
      turns: conv.turns,
      failureSignal: conv.failureSignal,
    });
  }

  return conversations;
}

/**
 * Check if a conversation has any Fin turns.
 * Conversations with zero Fin turns may indicate an issue.
 */
export function hasFinTurns(conversation: Conversation): boolean {
  return conversation.turns.some(turn => turn.role === 'fin');
}

/**
 * Get conversation by ID.
 * @throws {Error} If conversation with given ID is not found
 */
export function getConversationById(id: string): Conversation {
  const conversations = loadConversations();
  const conversation = conversations.find(c => c.id === id);
  
  if (!conversation) {
    throw new Error(`Conversation with id "${id}" not found`);
  }
  
  return conversation;
}
