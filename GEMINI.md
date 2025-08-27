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
- Includes a login button (non-functional for now).
- The content of the web will be in Spanish, but the code in English.
- It will explain what the tool does and the steps to create a new planner.

### 2. Authentication
- Users will log in via Google OAuth, powered by Supabase Auth.

### 3. Dashboard
- After logging in, users are presented with a dashboard displaying their existing shift planners in a card-based layout.
- If a user has no planners, a prominent call-to-action button will prompt them to create their first one.

### 4. New Planner Wizard
A three-step process for creating a new shift planner:
1.  **Date Selection**: Users select a start and end date for the planner using a component like `react-datepicker`.
2.  **Staff Management**: Users must add at least one staff member by name.
3.  **Holiday Selection**: Within the selected date range, users can mark any number of days as holidays.

### 5. Planner Interface
- Once the wizard is complete, the user is taken to the main planner view.
- **Layout**: A two-column design featuring a sidebar on the left and a calendar on the right.
- **Sidebar**:
    - Displays the information gathered during the wizard (start/end dates, staff members, holidays).
    - Contains a "Save" button to persist data to Supabase.
    - Includes a "Back to Dashboard" button to return to the list of planners.
- **Calendar View**:
    - The main area where the shift schedule will be displayed and managed.

## Development Rules

- **Language**: All code, comments, and documentation must be written in English, even if the user provides instructions in another language.
- **Commit Messages**: After completing a set of modifications, provide a descriptive commit message in English that summarizes the changes.
- **Development Server**: Do not run `npm run dev` or any other development server. The user will handle running the application.
- **Commits**: Do not commit changes. The user will handle all commits.
- **No Verify**: Do not use `git commit --no-verify`.