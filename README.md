# Trilero

A modern shift planner for organizing work schedules with style.

## Features

- **Visual Calendar** - Interactive FullCalendar interface for shift management
- **Staff Management** - Add team members with custom colors for easy identification
- **Holiday Support** - Mark holidays and special dates
- **PDF Export** - Generate printable schedules
- **No Account Required** - Data stored locally in your browser

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 |
| UI | React 19 + Tailwind CSS 4 |
| Calendar | FullCalendar |
| Language | TypeScript |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to start planning shifts.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── shift-planner/
│   │   ├── list/          # Dashboard with all planners
│   │   ├── new/           # Create new planner wizard
│   │   └── [id]/          # Individual planner view
├── components/
│   ├── landing/           # Landing page components
│   └── shift-planner/     # Planner UI components
├── types/                 # TypeScript interfaces
└── utils/                 # Helper functions
```

## License

MIT
