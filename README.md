# Repeat-Handoff Demo

A demonstration of conversation handoff scenarios showing different patterns where an assistant redirects to human support.

## Local Run Steps

### Prerequisites
- Node.js (v16 or later recommended)
- npm

### Setup and Run

1. Clone the repository:
```bash
git clone <repository-url>
cd Keb-Instruction-Repo
```

2. Install dependencies:
```bash
npm install
```

3. Run the demo:
```bash
npm run demo:repeat-handoff
```

### Running Specific Scenarios

To view a single scenario instead of all four:

```bash
npm run demo:repeat-handoff -- --scenario <scenario_id>
```

Valid scenario IDs: `repeat_loop`, `escalation_path`, `clarification_needed`, `successful_handoff`

Example:
```bash
npm run demo:repeat-handoff -- --scenario repeat_loop
```

## Demo Walkthrough

This demo presents four conversation scenarios that illustrate different handoff patterns:

### 1. Repeat Loop
**What happens:** A circular conversation where the user provides vague requests and the assistant repeatedly asks for clarification.

**Expected result:** After three rounds of unsuccessful clarification attempts, the assistant recognizes the pattern and offers to hand off to a human.

**Sample output:**
```
== repeat_loop ==

[user] Can you help me with this task?
[assistant] I need more information to help you. What specifically do you need?
[user] Just help me with the task.
[assistant] I understand you need help, but could you please provide more details about what task you need assistance with?
[user] The task I mentioned earlier.
[assistant] I see we are going in circles. Let me hand this off to a human who can better understand your needs.
```

### 2. Escalation Path
**What happens:** A user immediately requests to speak with a manager for an urgent account issue.

**Expected result:** The assistant acknowledges the urgency and agrees to escalate to a supervisor after a brief clarification attempt.

**Sample output:**
```
== escalation_path ==

[user] I need to speak with a manager about my account.
[assistant] I can help you with account issues. What seems to be the problem?
[user] This is urgent and I need a manager now.
[assistant] I understand this is urgent. Let me connect you with a supervisor who can assist you further.
```

### 3. Clarification Needed
**What happens:** A user makes extremely vague requests ("Fix my settings," "All of them") that prevent effective assistance.

**Expected result:** After multiple failed clarification attempts, the assistant recognizes that a comprehensive review is needed and offers to connect with someone who can help.

**Sample output:**
```
== clarification_needed ==

[user] Fix my settings.
[assistant] I can help with settings. Which settings would you like to change?
[user] The ones that are wrong.
[assistant] Could you tell me which specific settings seem incorrect to you?
[user] All of them.
[assistant] This might require a more detailed discussion. Let me connect you with someone who can review your account settings comprehensively.
```

### 4. Successful Handoff
**What happens:** A user provides clear information about a refund request for a damaged item.

**Expected result:** The assistant collects the necessary details (order number, reason) and then appropriately hands off to the specialized quality assurance team.

**Sample output:**
```
== successful_handoff ==

[user] I would like to request a refund for my last purchase.
[assistant] I can help with refund requests. Can you provide your order number?
[user] Yes, it is ORDER-12345. The item arrived damaged.
[assistant] I see. For damaged items, we need to process this through our quality assurance team. Let me transfer you to them with all the details you have provided.
```

## Important Notes

**⚠️ All conversation data in this demo is mock data for demonstration purposes only.**

- The scenarios are scripted examples designed to illustrate handoff patterns
- Order numbers, account issues, and user requests are fictional
- No real customer data or actual support conversations are included

### What This Demo Demonstrates

✅ **Demonstrated:**
- Four distinct conversation handoff patterns
- Scenario-based fixture loading
- Command-line scenario selection
- Basic conversation turn formatting

❌ **Not Included:**
- Real-time conversation handling
- Actual handoff integrations
- Natural language processing
- Database or persistent storage
- User authentication

### Scope Boundaries

This is a **demonstration-only** project showing conversation patterns. It does not:
- Connect to production systems
- Process real support tickets
- Store conversation history
- Implement actual handoff workflows

## Project Structure

```
Keb-Instruction-Repo/
├── demo/
│   └── repeat-handoff/
│       ├── run.ts          # Main demo entry point
│       └── fixtures.ts     # Conversation scenario definitions
├── package.json            # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Development

### TypeScript Configuration
The project uses TypeScript with ES modules. Configuration is in `tsconfig.json`.

### Adding New Scenarios
To add a new scenario:

1. Open `demo/repeat-handoff/fixtures.ts`
2. Add a new entry to the `fixtures` object with a unique ID
3. Define the conversation turns with roles and text
4. Run the demo to verify: `npm run demo:repeat-handoff -- --scenario your_new_id`

## Troubleshooting

**Error: `tsx: not found`**
- Make sure you've run `npm install` to install dependencies

**Error: `Unknown scenario ID`**
- Check that you're using one of the valid scenario IDs listed above
- Scenario IDs are case-sensitive

**TypeScript errors**
- Ensure you're using Node.js v16 or later
- Try removing `node_modules` and running `npm install` again
