
'use client';

import { EventInput } from '@fullcalendar/core';
import { getDay } from 'date-fns';

interface PersonsTableProps {
  events: EventInput[];
}

interface PersonRow {
  name: string;
  color: string;
  diario: number;
  vi: number;
  sa: number;
  do: number;
  total: number;
}

export default function PersonsTable({ events }: PersonsTableProps) {
  const processPersons = (): PersonRow[] => {
    const personMap = new Map<string, PersonRow>();

    events.forEach(event => {
      if (typeof event.title === 'string' && event.date) {
        const dayOfWeek = getDay(new Date(event.date as string)); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        if (!personMap.has(event.title)) {
          personMap.set(event.title, {
            name: event.title,
            color: event.backgroundColor || '#3788d8',
            diario: 0,
            vi: 0,
            sa: 0,
            do: 0,
            total: 0,
          });
        }

        const personRow = personMap.get(event.title)!;

        if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Monday to Thursday
          personRow.diario += 1;
        } else if (dayOfWeek === 5) { // Friday
          personRow.vi += 1;
        } else if (dayOfWeek === 6) { // Saturday
          personRow.sa += 1;
        } else if (dayOfWeek === 0) { // Sunday
          personRow.do += 1;
        }
        personRow.total += 1;
      }
    });

    return Array.from(personMap.values());
  };

  const personRows = processPersons();
  const totals = personRows.reduce((acc, person) => {
    acc.diario += person.diario;
    acc.vi += person.vi;
    acc.sa += person.sa;
    acc.do += person.do;
    acc.total += person.total;
    return acc;
    }, { diario: 0, vi: 0, sa: 0, do: 0, total: 0 });

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Persons Summary</h2>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-black uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-1 py-1">Persona</th>
            <th scope="col" className="px-1 py-1">Diario</th>
            <th scope="col" className="px-1 py-1">Vi</th>
            <th scope="col" className="px-1 py-1">Sa</th>
            <th scope="col" className="px-1 py-1">Do</th>
            <th scope="col" className="px-1 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {personRows.map(person => (
            <tr key={person.name} className="bg-white border-b">
              <td className="px-1 py-1 font-medium text-white whitespace-nowrap" style={{ backgroundColor: person.color }}>
                {person.name}
              </td>
              <td className="px-1 py-1">{person.diario > 0 ? person.diario : ''}</td>
              <td className="px-1 py-1">{person.vi > 0 ? person.vi : ''}</td>
              <td className="px-1 py-1">{person.sa > 0 ? person.sa : ''}</td>
              <td className="px-1 py-1">{person.do > 0 ? person.do : ''}</td>
              <td className="px-1 py-1">{person.total > 0 ? person.total : ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="text-xs text-black uppercase bg-gray-100">
            <tr>
                <th scope="row" className="px-1 py-1">Total</th>
                <td className="px-1 py-1">{totals.diario > 0 ? totals.diario : ''}</td>
                <td className="px-1 py-1">{totals.vi > 0 ? totals.vi : ''}</td>
                <td className="px-1 py-1">{totals.sa > 0 ? totals.sa : ''}</td>
                <td className="px-1 py-1">{totals.do > 0 ? totals.do : ''}</td>
                <td className="px-1 py-1">{totals.total > 0 ? totals.total : ''}</td>
            </tr>
        </tfoot>
      </table>
    </div>
  );
}
