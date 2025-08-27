'use client';

import { FC } from 'react';
import { EventInput } from '@fullcalendar/core';

interface PersonsTableProps {
  events: EventInput[];
}

const PersonsTable: FC<PersonsTableProps> = ({ events }) => {
  const workDaysCount = events.reduce((acc, event) => {
    const title = event.title || 'Unknown';
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">Work Days Count</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Person</th>
            <th className="px-4 py-2">Days</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(workDaysCount).map(([name, count]) => (
            <tr key={name}>
              <td className="border px-4 py-2">{name}</td>
              <td className="border px-4 py-2">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonsTable;