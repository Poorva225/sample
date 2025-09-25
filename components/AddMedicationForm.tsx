
import React, { useState } from 'react';
import type { Medication, MedicationInfo } from '../types';
import { fetchMedicationInfo } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface AddMedicationFormProps {
  onAdd: (medication: Omit<Medication, 'id'>) => void;
  onClose: () => void;
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [info, setInfo] = useState<MedicationInfo | undefined>(undefined);
  
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetInfo = async () => {
    if (!name.trim()) {
      setError("Please enter a medication name first.");
      return;
    }
    setIsLoadingInfo(true);
    setError(null);
    try {
      const fetchedInfo = await fetchMedicationInfo(name);
      setInfo(fetchedInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage || timesPerDay < 1) {
      setError("Please fill all required fields.");
      return;
    }
    onAdd({ name, dosage, timesPerDay: Number(timesPerDay), info });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Medication Name</label>
        <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 block w-full rounded-none rounded-l-md border-slate-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Ibuprofen"
              required
            />
            <button
                type="button"
                onClick={handleGetInfo}
                disabled={isLoadingInfo}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-slate-300 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-r-md disabled:bg-slate-200 disabled:cursor-not-allowed"
            >
                {isLoadingInfo ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <SparklesIcon className="h-5 w-5 text-blue-500"/>
                )}
                Get Info
            </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="dosage" className="block text-sm font-medium text-slate-700">Dosage</label>
        <input
          type="text"
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., 200mg"
          required
        />
      </div>

      <div>
        <label htmlFor="timesPerDay" className="block text-sm font-medium text-slate-700">Doses per Day</label>
        <input
          type="number"
          id="timesPerDay"
          value={timesPerDay}
          min="1"
          onChange={(e) => setTimesPerDay(parseInt(e.target.value, 10))}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      {info && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h4 className="font-bold text-blue-800">Medication Info Added</h4>
            <p className="text-sm text-blue-700">Uses and side effects fetched by Gemini will be saved.</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add Medication
        </button>
      </div>
    </form>
  );
};

export default AddMedicationForm;
