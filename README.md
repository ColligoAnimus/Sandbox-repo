# Data Export Tool - Task 04

This demo implements CSV export functionality with simulated export audit tracking (Task 04).

## Features

- **CSV Export**: Export data sources to CSV format with metadata headers
- **In-Memory Audit Trail**: Track all export operations with actor, source, timestamp, and format
- **Multiple Data Sources**: Demo includes Help Center (25 rows), CRM with partial permissions (9 rows), empty inventory, and analytics data
- **Browser UI**: Interactive web interface for selecting sources and exporting
- **CLI Interface**: Command-line tool for scripted exports

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
npm test
```

### 3. Use the CLI

**List available sources:**
```bash
npm run export:cli -- list
```

**Export a source:**
```bash
npm run export:cli -- export "Help Center"
```

**View audit trail:**
```bash
npm run export:cli -- audit
```

### 4. Use the Browser UI

Open `src/export-ui.html` in a web browser to use the interactive interface.

## Demo Scenarios

### Scenario 1: Help Center Export
- **Action**: Select "Help Center" and click Export CSV
- **Expected**: CSV with header + 25 rows, audit entry showing actor "demo-admin", source "Help Center", timestamp, and format "csv"

### Scenario 2: CRM Partial Permissions
- **Action**: Select "CRM (partial permissions)" and click Export CSV
- **Expected**: CSV includes warning line and only 9 readable rows, audit entry still recorded

### Scenario 3: Empty Source
- **Action**: Select "Inventory (Empty)" and click Export CSV
- **Expected**: CSV with header only (no data rows), audit entry still recorded

## Architecture

```
src/
├── data-sources.ts      # Mock data sources with inventory rows
├── csv-export.ts        # CSV generation and audit trail logic
├── export-cli.ts        # Command-line interface
├── export-ui.html       # Browser-based UI
└── csv-export.test.ts   # Automated tests
```

## CSV Format

Exported CSV files include:
- **Metadata headers** (commented lines starting with `#`)
  - Source name
  - Workspace ID (mock: `ws_demo_12345`)
  - Generation timestamp
  - Row count
  - Warning message (if applicable)
- **CSV header row**: `ID,Name,Status,Last Modified,Owner`
- **Data rows**: One row per inventory item

## Audit Trail

Each export operation records:
- **Actor**: User who performed the export (demo: "demo-admin")
- **Source**: Name of the exported data source
- **Timestamp**: ISO 8601 timestamp
- **Format**: Export format (always "csv" in this demo)

The audit trail is stored **in-memory only** for demo purposes. In a production system, this would be persisted to a database or audit service.

## Test Coverage

```bash
npm test
```

Tests verify:
- ✅ Data sources load correctly with expected row counts
- ✅ CSV export includes metadata, headers, and correct row count
- ✅ Audit trail records entries correctly
- ✅ Empty source exports produce header-only CSV
- ✅ CRM export includes warning for partial permissions
- ✅ CSV row count exactly matches table row count for all sources

## Dependencies

Built on tasks 02 and 03:
- **Task 02**: Entry point (`demo/repeat-handoff/run.ts`)
- **Task 03**: Inventory concept (`demo/repeat-handoff/fixtures.ts`)

## Limitations (Demo Only)

- **In-memory audit**: Audit trail resets on each CLI execution
- **No authentication**: Actor is hardcoded as "demo-admin"
- **Mock workspace ID**: Uses fake workspace identifier
- **Local files only**: No cloud storage or signed URLs
- **CSV format only**: No PDF, Excel, or other formats
- **No rejection logic**: All exports are recorded; no access control checks

## Files Generated

Exports are saved to:
```
exports/
└── {source_id}_{timestamp}.csv
```

Example: `exports/help_center_1792108033247.csv`
