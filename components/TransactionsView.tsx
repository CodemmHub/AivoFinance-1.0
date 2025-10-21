import React from 'react';
import { Transaction, Wallet } from '../types';
import { TransactionItem } from './TransactionItem';

interface TransactionsViewProps {
  transactions: Transaction[];
  wallets: Wallet[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, wallets, onEditTransaction, onDeleteTransaction }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">All Transactions</h1>
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <div className="space-y-4">
            {transactions.length > 0 ? (
                transactions.map(transaction => (
                    <TransactionItem 
                      key={transaction.id} 
                      transaction={transaction} 
                      wallets={wallets} 
                      onEdit={onEditTransaction}
                      onDelete={onDeleteTransaction}
                    />
                ))
            ) : (
                <p className="text-center py-10 text-gray-500 dark:text-gray-400">You have no transactions recorded.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsView;