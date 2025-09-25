
import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Medication, HistoryEntry } from './types';
import Header from './components/Header';
import TodaysSchedule from './components/TodaysSchedule';
import MedicationList from './components/MedicationList';
import HistoryLog from './components/HistoryLog';
import Modal from './components/Modal';
import AddMedicationForm from './components/AddMedicationForm';
import PlusIcon from './components/icons/PlusIcon';
import PillIcon from './components/icons/PillIcon';
import ClockIcon from './components/icons/ClockIcon';

type Tab = 'schedule' | 'medications' | 'history';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => {
    const baseClasses = "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors";
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "text-slate-600 hover:bg-slate-200";
    return (
        <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
}

const App: React.FC = () => {
  const [medications, setMedications] = useLocalStorage<Medication[]>('medications', []);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('history', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('schedule');

  const handleAddMedication = (med: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...med,
      id: crypto.randomUUID(),
    };
    setMedications([...medications, newMedication]);
  };

  const handleDeleteMedication = (medicationId: string) => {
    setMedications(medications.filter(med => med.id !== medicationId));
    // Optional: Also remove from history, or keep for records
    // setHistory(history.filter(entry => entry.medicationId !== medicationId));
  };
  
  const handleTakeMedication = (medicationId: string) => {
    const newHistoryEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      medicationId,
      timestamp: Date.now(),
    };
    setHistory([...history, newHistoryEntry]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <TodaysSchedule medications={medications} history={history} onTakeMedication={handleTakeMedication} />;
      case 'medications':
        return <MedicationList medications={medications} onDelete={handleDeleteMedication} />;
      case 'history':
        return <HistoryLog history={history} medications={medications} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="p-1 bg-slate-100 rounded-lg flex space-x-1">
                <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')}>
                    <ClockIcon className="w-5 h-5"/> <span>Today's Schedule</span>
                </TabButton>
                <TabButton active={activeTab === 'medications'} onClick={() => setActiveTab('medications')}>
                    <PillIcon className="w-5 h-5"/> <span>All Medications</span>
                </TabButton>
                 <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
                    <ClockIcon className="w-5 h-5"/> <span>History</span>
                </TabButton>
            </div>
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full md:w-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center space-x-2"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Add Medication</span>
            </button>
        </div>

        <div className="bg-slate-100 p-4 rounded-lg">
          {renderContent()}
        </div>
      </main>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Medication">
        <AddMedicationForm 
          onAdd={handleAddMedication} 
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default App;
