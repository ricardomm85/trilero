# Trilero Project

## Overview

Trilero is a high-performance and aesthetically pleasing web application designed for organizing work shifts. It is built with a modern tech stack, emphasizing speed and a clean user interface. The project will be developed iteratively, with a focus on minimizing external dependencies unless strictly necessary.

## Technology Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Database & Authentication**: Supabase (PostgreSQL)

## Core Functionality

### 1. Landing Page
- A static, public-facing page detailing the application's features.
- Includes a functional login button.

- It will explain what the tool does and the steps to create a new planner.

### 2. Authentication
- Users will log in via Google OAuth, powered by Supabase Auth.

### 3. Logged-In Header
- Once a user is logged in, the main header will display two main actions:
  - A button or link to navigate to the `/shift-planner/list` page, labeled "My Planners" or similar.
  - A "Logout" button.

### 4. Shift Planner List (`/shift-planner/list`)
- After logging in, users are redirected to their dashboard at `/shift-planner/list`.
- This page displays all their existing shift planners in a card-based layout.
- If a user has no planners, a prominent call-to-action button will prompt them to create their first one by navigating to `/shift-planner/new`.
- Each card displays the planner's start date, end date, and the total number of staff members, and links to `/shift-planner/[id]`.
- Each planner will have a unique ID generated with `nanoid`.
- Initially, this information will be stored in the browser's `localStorage`. Supabase will be integrated in the future for persistent storage.

### 5. New Planner Wizard (`/shift-planner/new`)
A three-step process for creating a new shift planner, located at `/shift-planner/new`:
1.  **Date Selection**: Users select a start and end date for the planner using a component like `react-datepicker`.
2.  **Staff Management**: Users must add at least one staff member by name.
3.  **Holiday Selection**: Within the selected date range, users can mark any number of days as holidays.

### 6. Planner Interface (`/shift-planner/[id]`)
- The main interface for a single planner, accessible at `/shift-planner/[id]`.
- The previous functional version at `/dashboard` will be refactored and moved here.
- **Layout**: A two-column design featuring a sidebar on the left and a calendar on the right.
- **Sidebar**:
    - Displays the information for the given planner (start/end dates, staff members, holidays).
    - Contains a "Save" button to persist data.
    - Includes a "Back to List" button to return to the `/shift-planner/list` page.
- **Calendar View**:
    - The main area where the shift schedule will be displayed and managed.

### 7. Data Model
The core data entity is the `ShiftPlanner`.

#### ShiftPlanner
- `id`: `string` (nanoid) - Unique planner identifier.
- `name`: `string` - User-defined name for the planner.
- `startDate`: `string` - Start date in `YYYY-MM-DD` format.
- `endDate`: `string` - End date in `YYYY-MM-DD` format.
- `staff`: `StaffMember[]` - Array of staff members.
- `holidays`: `Holiday[]` - Array of holidays.
- `assignments`: `ShiftAssignments` - Object mapping dates to assigned staff.

#### StaffMember
- `id`: `string` (nanoid) - Unique staff member identifier.
- `name`: `string`
- `color`: `string` - Hex color code for the UI.

#### Holiday
- `date`: `string` - Date in `YYYY-MM-DD` format.
- `name`: `string`

#### ShiftAssignments
- An object where keys are dates (`YYYY-MM-DD`) and values are an array of `StaffMember.id` strings.

This model will be stored in `localStorage` as a JSON string and will be used for the future PostgreSQL database schema.

### Refactoring Notes
- The interfaces `Person` and `DayPerson` located in `src/types/index.ts` are part of the legacy data model used in the original `/dashboard` page.
- As we refactor the application to use the new `ShiftPlanner` data model and the `/shift-planner/*` routes, all usages of `Person` and `DayPerson` should be replaced.
- Once the refactor is complete, these deprecated interfaces should be removed from the codebase.

## Development Rules

- **Language**:
  - All code, comments, and commit messages must be written in English.
  - All user-facing text in the web application must be in Spanish.
- **Commit Messages**: After completing a set of modifications, provide a descriptive commit message in English that summarizes the changes.
- **Development Server**: Do not run `npm run dev` or any other development server. The user will handle running the application.
- **Commits**: Do not commit changes. The user will handle all commits.
- **No Verify**: Do not use `git commit --no-verify`.