# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trilero is a shift planner web application for organizing work schedules. Users can create planners with date ranges, add staff members, mark holidays, and assign shifts via an interactive calendar.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm run test     # Run tests in watch mode
npm run test:run # Run tests once
```

## Tech Stack

- **Node.js 24** (LTS)
- **Next.js 16** with App Router (Turbopack)
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **FullCalendar** for calendar UI (lazy-loaded via `CalendarWrapper`)
- **localStorage** for data persistence (no backend currently)
- **Vitest** + **Testing Library** for unit tests

## Architecture

### Routes (`src/app/`)
- `/` - Landing page
- `/shift-planner/list` - Dashboard showing all planners
- `/shift-planner/new` - 3-step wizard to create a planner
- `/shift-planner/[id]` - Main planner interface with sidebar + calendar

### Data Model (`src/types/index.ts`)
```typescript
ShiftPlanner {
  id: string           // nanoid
  name: string
  startDate: string    // YYYY-MM-DD
  endDate: string      // YYYY-MM-DD
  staff: StaffMember[]
  holidays: Holiday[]
  assignments: { [date: string]: string[] }  // date -> staff IDs
}
```

### Key Components (`src/components/shift-planner/`)
- `PlannerSidebar` - Left panel with planner info and edit modals
- `PlannerCalendar` - FullCalendar wrapper displaying shifts
- `CalendarWrapper` - Dynamic import wrapper to reduce bundle size
- `new/Step1Info`, `Step2Staff`, `Step3Holidays` - Wizard steps

### Storage
Data is stored in `localStorage` under key `shiftPlanners` as JSON array.

## Development Rules

- **Code/comments**: English
- **UI text**: Spanish
- **Do not run** `npm run dev` - user handles the dev server
- **Do not commit** unless explicitly asked
- **Never use** `git commit --no-verify`
- **No Claude references in commits** - Do not include "Generated with Claude", "Co-Authored-By: Claude", or similar references in commit messages
- **Prefer native APIs over libraries** - Use built-in browser APIs before adding dependencies:
  - HTML5 Drag and Drop API (no external drag libraries)
  - Fetch API (no axios)
  - Native form validation
  - CSS animations over JS animation libraries
  - Intl API for formatting dates/numbers

## Testing

- **Framework**: Vitest with jsdom environment
- **Libraries**: @testing-library/react, @testing-library/jest-dom
- **Location**: Test files are colocated with components (`*.test.tsx`)
- **Pre-commit**: Tests run automatically before each commit
- **CI**: GitHub Actions runs tests on every push/PR

When adding new components, create corresponding test files following the pattern in `StaffSummaryTable.test.tsx`.

## Next.js 16 Notes

- Uses `proxy.ts` instead of `middleware.ts` (renamed in v16)
- `next lint` removed - use `eslint` directly
