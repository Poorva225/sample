
import React, { useState } from 'react';
import type { Medication } from '../types';
import TrashIcon from './icons/TrashIcon';
import SparklesIcon from './icons/SparklesIcon';
import PillIcon from './icons/PillIcon';

interface MedicationListProps {
  medications: Medication[];
  onDelete: (medicationId: string) => void;
}

const MedicationItem: React.FC<{medication: Medication, onDelete: (id: string) => void}> = ({ medication, onDelete }) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">{medication.name}</h3>
                    <p className="text-slate-500 text-sm">{medication.dosage} - {medication.timesPerDay} time(s) a day</p>
                </div>
                <div className="flex items-center space-x-2">
                    {medication.info && (
                        <button
                            onClick={() => setIsInfoVisible(!isInfoVisible)}
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                            aria-label="Toggle medication info"
                        >
                           <SparklesIcon className="w-5 h-5"/>
                        </button>
                    )}
                    <button 
                        onClick={() => onDelete(medication.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Delete medication"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {isInfoVisible && medication.info && (
                <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 p-3 rounded-md">
                    <div>
                        <h4 className="font-semibold text-slate-700">Common Uses:</h4>
                        <ul className="list-disc list-inside text-slate-600 text-sm mt-1 space-y-1">
                            {medication.info.uses.map((use, i) => <li key={i}>{use}</li>)}
                        </ul>
                    </div>
                    <div className="mt-3">
                        <h4 className="font-semibold text-slate-700">Common Side Effects:</h4>
                         <ul className="list-disc list-inside text-slate-600 text-sm mt-1 space-y-1">
                            {medication.info.sideEffects.map((effect, i) => <li key={i}>{effect}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const MedicationList: React.FC<MedicationListProps> = ({ medications, onDelete }) => {
  if (medications.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-lg shadow">
        <PillIcon className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-lg font-medium text-slate-900">No Medications</h3>
        <p className="mt-1 text-sm text-slate-500">You haven't added any medications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map(med => (
        <MedicationItem key={med.id} medication={med} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default MedicationList;
