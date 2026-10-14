# Repeat Handoff Demo

Demo implementation of deterministic fixtures for repeat-handoff scenarios with synthetic Fin conversations.

## Overview

This demo provides a fixture file with four synthetic conversation scenarios that demonstrate different handoff conditions:

1. **repeat_loop** - A conversation where the user is stuck in a repetitive loop
2. **declined_offer** - A conversation where the user declines the handoff offer
3. **explicit_human** - A conversation where the user explicitly requests a human agent
4. **support_unavailable** - A conversation where support is currently unavailable

## Structure

```
demo/repeat-handoff/
├── fixtures/
│   └── conversations.json    # Four synthetic Fin conversations
├── fixtures.ts               # Loader with validation
└── fixtures.test.ts          # Test suite
```

## Usage

### Load all conversations

```typescript
import { loadConversations } from './fixtures.js';

const conversations = loadConversations();
// Returns array of 4 conversations in file order
```

### Get a specific conversation

```typescript
import { getConversationById } from './fixtures.js';

const repeatLoop = getConversationById('repeat_loop');
console.log(repeatLoop.failureSignal.repeatLoop); // true
```

### Check if conversation has Fin turns

```typescript
import { hasFinTurns } from './fixtures.js';

const hasFin = hasFinTurns(conversation);
// Returns true if conversation contains at least one Fin turn
```

## Data Structure

Each conversation has the following structure:

```typescript
interface Conversation {
  id: string;
  turns: Turn[];
  failureSignal: FailureSignal;
}

interface Turn {
  role: 'user' | 'fin';
  text: string;
  turnId: string;
}

interface FailureSignal {
  repeatLoop: boolean;
  declined: boolean;
  explicitHumanRequest: boolean;
  supportUnavailable: boolean;
}
```

## Validation

The loader validates:
- All conversations have required fields: `id`, `turns`, `failureSignal`
- All turns have required fields: `role`, `text`, `turnId`
- All `failureSignal` fields are booleans
- Turn roles are either `'user'` or `'fin'`

Missing required fields throw descriptive errors that identify the conversation and field.

## Running Tests

```bash
npm test
```

Expected output: 10 passing tests validating:
- Exactly 4 conversations are returned
- Conversations are in file order with expected IDs
- All required fields are present and valid
- Loader throws errors for missing fields
- Each scenario has correct failure signals
- Conversations with zero Fin turns are detectable

## Requirements Demonstrated

This fixture demonstrates requirements:
- **R1**: Repeat loop detection
- **R2**: Declined offer handling
- **R4**: Explicit human request recognition
- **R6**: Support unavailability handling

## Notes

- All conversation data is synthetic and does not contain real customer data
- Turn text uses short, clear English sentences
- The fixture is deterministic and suitable for testing
