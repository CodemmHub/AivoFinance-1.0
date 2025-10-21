import React, { useMemo } from 'react';
import { Check, CheckStatus, Wallet } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { ReceiptPercentIcon } from './icons/ReceiptPercentIcon';
import { CheckItem } from './CheckItem';

interface ChecksViewProps {
  checks: Check[];
  wallets: Wallet[];
  onAddCheck: () => void;
  onUpdateCheckStatus: (checkId: string, newStatus: CheckStatus) => void;
}

const ChecksList: React.FC<{
    title: string;
    checks: Check[];
    wallets: Wallet[];
    onUpdateCheckStatus: (checkId: string, newStatus: CheckStatus) => void;
}> = ({ title, checks, wallets, onUpdateCheckStatus }) => (
    <div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 px-2">{title}</h2>
        <div className="space-y-3">
        {checks.length > 0 ? (
            checks.map(check => (
            <CheckItem key={check.id} check={check} wallets={wallets} onUpdateCheckStatus={onUpdateCheckStatus} />
            ))
        ) : (
            <p className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">No checks in this category.</p>
        )}
        </div>
    </div>
);

const ChecksView: React.FC<ChecksViewProps> = ({ checks, wallets, onAddCheck, onUpdateCheckStatus }) => {
  const { pending, cleared, bounced, canceled } = useMemo(() => {
    const pending: Check[] = [];
    const cleared: Check[] = [];
    const bounced: Check[] = [];
    const canceled: Check[] = [];
    checks.forEach(check => {
        switch (check.status) {
            case CheckStatus.PENDING:
                pending.push(check);
                break;
            case CheckStatus.CLEARED:
                cleared.push(check);
                break;
            case CheckStatus.BOUNCED:
                bounced.push(check);
                break;
            case CheckStatus.CANCELED:
                canceled.push(check);
                break;
        }
    });
    // Sort pending checks by due date
    pending.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return { pending, cleared, bounced, canceled };
  }, [checks]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Checks</h1>
        <button
          onClick={onAddCheck}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Check
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md space-y-8">
        {checks.length > 0 ? (
            <>
                <ChecksList title="Pending Checks" checks={pending} wallets={wallets} onUpdateCheckStatus={onUpdateCheckStatus} />
                <ChecksList title="Cleared Checks" checks={cleared} wallets={wallets} onUpdateCheckStatus={onUpdateCheckStatus} />
                <ChecksList title="Bounced Checks" checks={bounced} wallets={wallets} onUpdateCheckStatus={onUpdateCheckStatus} />
                <ChecksList title="Canceled Checks" checks={canceled} wallets={wallets} onUpdateCheckStatus={onUpdateCheckStatus} />
            </>
        ) : (
            <div className="text-center py-16">
                <ReceiptPercentIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">No checks issued yet.</p>
                <p className="text-gray-500 dark:text-gray-400">Click "Add Check" to start tracking your check payments.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChecksView;