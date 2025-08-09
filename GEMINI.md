# Trilero Project

## Overview

This project is a web application for calendar management. The initial phase focuses on allowing users to select a date range and view a large calendar where they can add daily notes.

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
  - The sidebar will contain two `react-day-picker` inputs for selecting a start date and an end date.
- **Interactive Calendar**:
  - The main content area will feature a large `FullCalendar` instance.
  - The calendar will display the date range selected by the user.
  - Users will be able to click on a day to add a simple text note.

## Development Rules

- **Language**: All code, comments, and documentation must be written in English, even if the user provides instructions in another language.
- **Commit Messages**: After completing a set of modifications, provide a descriptive commit message in English that summarizes the changes one sentence if possible.
