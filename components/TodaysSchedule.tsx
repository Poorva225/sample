
import React from 'react';
import type { Medication, HistoryEntry } from '../types';
import CheckIcon from './icons/CheckIcon';
import PillIcon from './icons/PillIcon';

interface TodaysScheduleProps {
  medications: Medication[];
  history: HistoryEntry[];
  onTakeMedication: (medicationId: string) => void;
}

const isToday = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const TodaysSchedule: React.FC<TodaysScheduleProps> = ({ medications, history, onTakeMedication }) => {
  if (medications.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-lg shadow">
        <PillIcon className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-lg font-medium text-slate-900">No Medications</h3>
        <p className="mt-1 text-sm text-slate-500">Add a medication to see your schedule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map(med => {
        const timesTakenToday = history.filter(h => h.medicationId === med.id && isToday(h.timestamp)).length;
        const isCompleted = timesTakenToday >= med.timesPerDay;

        return (
          <div key={med.id} className={`bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all ${isCompleted ? 'opacity-60' : ''}`}>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">{med.name}</h3>
              <p className="text-slate-500 text-sm">{med.dosage}</p>
              <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600 font-semibold">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(timesTakenToday / med.timesPerDay) * 100}%` }}></div>
                </div>
                <span className="whitespace-nowrap">{timesTakenToday} / {med.timesPerDay} taken</span>
              </div>
            </div>
            <div className="ml-4">
              {isCompleted ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckIcon className="h-6 w-6" />
                  <span className="font-semibold">Done!</span>
                </div>
              ) : (
                <button
                  onClick={() => onTakeMedication(med.id)}
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                >
                  <CheckIcon className="h-5 w-5" />
                  <span>Take</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TodaysSchedule;
