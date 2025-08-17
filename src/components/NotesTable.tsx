'use client';

import { EventInput } from '@fullcalendar/core';
import { getDay } from 'date-fns';

interface NotesTableProps {
  events: EventInput[];
}

interface NoteRow {
  title: string;
  diario: number;
  vi: number;
  sa: number;
  do: number;
  total: number;
}

export default function NotesTable({ events }: NotesTableProps) {
  const processNotes = (): NoteRow[] => {
    const noteMap = new Map<string, NoteRow>();

    events.forEach(event => {
      if (typeof event.title === 'string' && event.date) {
        const dayOfWeek = getDay(new Date(event.date as string)); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        if (!noteMap.has(event.title)) {
          noteMap.set(event.title, {
            title: event.title,
            diario: 0,
            vi: 0,
            sa: 0,
            do: 0,
            total: 0,
          });
        }

        const noteRow = noteMap.get(event.title)!;

        if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Monday to Thursday
          noteRow.diario += 1;
        } else if (dayOfWeek === 5) { // Friday
          noteRow.vi += 1;
        } else if (dayOfWeek === 6) { // Saturday
          noteRow.sa += 1;
        } else if (dayOfWeek === 0) { // Sunday
          noteRow.do += 1;
        }
        noteRow.total += 1;
      }
    });

    return Array.from(noteMap.values());
  };

  const noteRows = processNotes();
  const totals = noteRows.reduce((acc, note) => {
    acc.diario += note.diario;
    acc.vi += note.vi;
    acc.sa += note.sa;
    acc.do += note.do;
    acc.total += note.total;
    return acc;
    }, { diario: 0, vi: 0, sa: 0, do: 0, total: 0 });

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Notes Summary</h2>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-1 py-1">Nota</th>
            <th scope="col" className="px-1 py-1">Diario</th>
            <th scope="col" className="px-1 py-1">Vi</th>
            <th scope="col" className="px-1 py-1">Sa</th>
            <th scope="col" className="px-1 py-1">Do</th>
            <th scope="col" className="px-1 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {noteRows.map(note => (
            <tr key={note.title} className="bg-white border-b">
              <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap">
                {note.title}
              </th>
              <td className="px-1 py-1">{note.diario > 0 ? note.diario : ''}</td>
              <td className="px-1 py-1">{note.vi > 0 ? note.vi : ''}</td>
              <td className="px-1 py-1">{note.sa > 0 ? note.sa : ''}</td>
              <td className="px-1 py-1">{note.do > 0 ? note.do : ''}</td>
              <td className="px-1 py-1">{note.total > 0 ? note.total : ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="text-xs text-gray-700 uppercase bg-gray-100">
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
