import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Wallet, Transaction, TransactionType } from '../types';
import { WalletIcon } from './icons/WalletIcon';
import { PlusIcon } from './icons/PlusIcon';
import { calculateWalletBalance } from '../utils/calculations';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';


const WalletItem: React.FC<{
  wallet: Wallet;
  balance: number;
  onEdit: (wallet: Wallet) => void;
  onDelete: (id: string) => void;
}> = ({ wallet, balance, onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatCurrency = (amount: number, currency: string) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    };

    return (
       <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50">
                  <WalletIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{wallet.name} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({wallet.currency})</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Initial Balance: {formatCurrency(wallet.initialBalance, wallet.currency)}</p>
              </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
                  <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{formatCurrency(balance, wallet.currency)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
            </div>
             <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                        <button onClick={() => { onEdit(wallet); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
                        <button onClick={() => { onDelete(wallet.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>
                    </div>
                )}
            </div>
          </div>
      </div>
    )
}

interface WalletsViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  onAddWallet: () => void;
  onEditWallet: (wallet: Wallet) => void;
  onDeleteWallet: (id: string) => void;
}

const WalletsView: React.FC<WalletsViewProps> = ({ wallets, transactions, onAddWallet, onEditWallet, onDeleteWallet }) => {
  
  const walletBalances = useMemo(() => {
    const balances = new Map<string, number>();
    wallets.forEach(wallet => {
      balances.set(wallet.id, calculateWalletBalance(wallet, transactions));
    });
    return balances;
  }, [wallets, transactions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Wallets</h1>
        <button
          onClick={onAddWallet}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Wallet
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <div className="space-y-4">
            {wallets.length > 0 ? (
                wallets.map(wallet => (
                  <WalletItem 
                    key={wallet.id}
                    wallet={wallet}
                    balance={walletBalances.get(wallet.id) || 0}
                    onEdit={onEditWallet}
                    onDelete={onDeleteWallet}
                  />
                ))
            ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <WalletIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-semibold">No wallets found.</p>
                    <p className="text-sm">Click "Add Wallet" to get started.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WalletsView;