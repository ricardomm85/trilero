// New Data Model
export interface StaffMember {
  id: string; // Unique ID (nanoid)
  name: string;
  color: string; // A color to represent the person in the UI
  position: number; // For ordering in the UI
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
  creationDate: string; // ISO 8601 format
  startDate: string; // Format: "YYYY-MM-DD"
  endDate: string; // Format: "YYYY-MM-DD"
  staff: StaffMember[];
  holidays: Holiday[];
  assignments: ShiftAssignments;
}
