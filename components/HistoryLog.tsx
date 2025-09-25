
import React from 'react';
import type { Medication, HistoryEntry } from '../types';
import ClockIcon from './icons/ClockIcon';

interface HistoryLogProps {
  history: HistoryEntry[];
  medications: Medication[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history, medications }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-lg shadow">
        <ClockIcon className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-lg font-medium text-slate-900">No History</h3>
        <p className="mt-1 text-sm text-slate-500">Take a medication to start your history log.</p>
      </div>
    );
  }

  const groupedHistory = history.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, HistoryEntry[]>);
  
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => {
      return new Date(groupedHistory[b][0].timestamp).getTime() - new Date(groupedHistory[a][0].timestamp).getTime();
  });


  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date}>
          <h3 className="text-lg font-semibold text-slate-600 pb-2 mb-2 border-b border-slate-200">{date}</h3>
          <ul className="space-y-3">
            {groupedHistory[date]
                .sort((a,b) => b.timestamp - a.timestamp)
                .map(entry => {
                    const med = medications.find(m => m.id === entry.medicationId);
                    if (!med) return null;
                    return (
                        <li key={entry.id} className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800">{med.name}</p>
                                <p className="text-sm text-slate-500">{med.dosage}</p>
                            </div>
                            <p className="text-sm text-slate-600">
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </li>
                    );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default HistoryLog;
