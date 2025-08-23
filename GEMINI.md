# Trilero Project

## Overview

This project is a web application for calendar management. The initial phase focuses on allowing users to select a date range and view a large calendar where they can add, view, and delete daily notes. All data is persisted in the browser's Local Storage.

## Technology Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Main Calendar**: FullCalendar (`@fullcalendar/react`) for the main interactive calendar view.
- **Date Picker**: react-day-picker for selecting start and end dates in the sidebar.
- **Backend & Database**: Supabase (for future implementation).
- **Deployment**: Vercel (for future implementation).

## Phase 1: Core Functionality

- **Two-Column Layout**:
  - A narrow sidebar on the left for user inputs.
  - A wider main content area on the right for the calendar display.
- **Date Range Selection**:
  - The sidebar contains a `react-day-picker` input for selecting a start and end date.
- **Interactive Calendar**:
  - The main content area features a large, scrollable `FullCalendar` instance.
  - Users can click on a day to add a simple text note.
  - Users can click on an existing note to delete it.
- **Data Persistence**:
  - The selected date range is automatically saved to the browser's Local Storage and reloaded on the next visit.
  - All calendar notes are also saved to Local Storage, persisting them between sessions.

## Development Rules

- **Language**: All code, comments, and documentation must be written in English, even if the user provides instructions in another language.
- **Commit Messages**: After completing a set of modifications, provide a descriptive commit message in English that summarizes the changes.
- **Development Server**: Do not run `npm run dev` or any other development server. The user will handle running the application.
- **Commits**: Do not commit changes. The user will handle all commits.
- **No Verify**: Do not use `git commit --no-verify`.