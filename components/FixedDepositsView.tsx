import React from 'react';
import { FixedDeposit } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { BuildingLibraryIcon } from './icons/BuildingLibraryIcon';
import { FixedDepositItem } from './FixedDepositItem';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface FixedDepositsViewProps {
  fixedDeposits: FixedDeposit[];
  onAddFixedDeposit: () => void;
  onEditFixedDeposit: (fd: FixedDeposit) => void;
  onDeleteFixedDeposit: (id: string) => void;
}

const FixedDepositsView: React.FC<FixedDepositsViewProps> = ({ fixedDeposits, onAddFixedDeposit, onEditFixedDeposit, onDeleteFixedDeposit }) => {
  const sortedFDs = [...fixedDeposits].sort((a, b) => new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime());
  const formatCurrency = useCurrencyFormatter();
  
  const totalPrincipal = fixedDeposits.reduce((sum, fd) => sum + fd.principalAmount, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Fixed Deposits</h1>
        <button
          onClick={onAddFixedDeposit}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add FD
        </button>
      </div>

       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">Total Principal Invested</h2>
        <p className="text-4xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalPrincipal)}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <div className="space-y-4">
          {sortedFDs.length > 0 ? (
            sortedFDs.map(fd => (
              <FixedDepositItem key={fd.id} fd={fd} onEdit={onEditFixedDeposit} onDelete={onDeleteFixedDeposit} />
            ))
          ) : (
            <div className="text-center py-16">
                <BuildingLibraryIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">No fixed deposits found.</p>
                <p className="text-gray-500 dark:text-gray-400">Click "Add FD" to track your investments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixedDepositsView;
