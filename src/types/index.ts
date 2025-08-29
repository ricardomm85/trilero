/**
 * @deprecated These interfaces are part of the old data model and will be removed after the refactor.
 * Use ShiftPlanner and its related interfaces instead.
 */
export interface Person {
  id: string;
  name: string;
  color: string;
}

/**
 * @deprecated These interfaces are part of the old data model and will be removed after the refactor.
 * Use ShiftPlanner and its related interfaces instead.
 */
export interface DayPerson {
  date: string;
  personId: string;
}

// New Data Model
export interface StaffMember {
  id: string; // Unique ID (nanoid)
  name: string;
  color: string; // A color to represent the person in the UI
}

export interface Holiday {
  date: string; // Format: "YYYY-MM-DD"
  name: string;
}

export interface ShiftAssignments {
  // Key is the date in "YYYY-MM-DD" format
  // Value is an array of StaffMember IDs
  [date: string]: string[];
}

export interface ShiftPlanner {
  id: string; // Unique ID for the planner (nanoid)
  name: string;
  startDate: string; // Format: "YYYY-MM-DD"
  endDate: string; // Format: "YYYY-MM-DD"
  staff: StaffMember[];
  holidays: Holiday[];
  assignments: ShiftAssignments;
}