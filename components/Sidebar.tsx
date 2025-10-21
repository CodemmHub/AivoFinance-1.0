import React, { useState } from 'react';
import { DashboardIcon } from './icons/DashboardIcon';
import { ListIcon } from './icons/ListIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { WalletIcon } from './icons/WalletIcon';
import { TagIcon } from './icons/TagIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { BuildingLibraryIcon } from './icons/BuildingLibraryIcon';
import { ReceiptPercentIcon } from './icons/ReceiptPercentIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { FlagIcon } from './icons/FlagIcon';
import { ArrowUpOnSquareIcon } from './icons/ArrowUpOnSquareIcon';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <div className="w-5 h-5 mr-3">{icon}</div>
    <span>{label}</span>
  </button>
);

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
  userEmail: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout, userEmail }) => {
  const [shareText, setShareText] = useState('Share App');

  const handleShare = async () => {
    const shareData = {
      title: 'AivoFinance',
      text: 'Check out this personal finance app!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareText('Link Copied!');
        setTimeout(() => setShareText('Share App'), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Could not copy link to clipboard.');
      }
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="p-2 bg-blue-600 rounded-lg mr-3">
          <BanknotesIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">AivoFinance</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <NavItem
          icon={<DashboardIcon />}
          label="Dashboard"
          active={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
        />
        <NavItem
          icon={<ChartBarIcon />}
          label="Reports"
          active={currentView === 'reports'}
          onClick={() => setCurrentView('reports')}
        />
        <NavItem
          icon={<ListIcon />}
          label="Transactions"
          active={currentView === 'transactions'}
          onClick={() => setCurrentView('transactions')}
        />
         <NavItem
          icon={<WalletIcon />}
          label="Wallets"
          active={currentView === 'wallets'}
          onClick={() => setCurrentView('wallets')}
        />
        <NavItem
          icon={<ScaleIcon />}
          label="Budgets"
          active={currentView === 'budgets'}
          onClick={() => setCurrentView('budgets')}
        />
        <NavItem
          icon={<FlagIcon />}
          label="Goals"
          active={currentView === 'goals'}
          onClick={() => setCurrentView('goals')}
        />
        <NavItem
          icon={<CreditCardIcon />}
          label="Debts"
          active={currentView === 'debts'}
          onClick={() => setCurrentView('debts')}
        />
        <NavItem
          icon={<CalendarDaysIcon />}
          label="Subscriptions"
          active={currentView === 'subscriptions'}
          onClick={() => setCurrentView('subscriptions')}
        />
        <NavItem
          icon={<ReceiptPercentIcon />}
          label="Checks"
          active={currentView === 'checks'}
          onClick={() => setCurrentView('checks')}
        />
        <NavItem
          icon={<BanknotesIcon />}
          label="Assets"
          active={currentView === 'assets'}
          onClick={() => setCurrentView('assets')}
        />
        <NavItem
          icon={<BuildingLibraryIcon />}
          label="Fixed Deposits"
          active={currentView === 'fixed_deposits'}
          onClick={() => setCurrentView('fixed_deposits')}
        />
         <NavItem
          icon={<TagIcon />}
          label="Categories"
          active={currentView === 'categories'}
          onClick={() => setCurrentView('categories')}
        />
        <NavItem
          icon={<SparklesIcon />}
          label="AI Assistant"
          active={currentView === 'ai_assistant'}
          onClick={() => setCurrentView('ai_assistant')}
        />
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 mb-4">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={userEmail}>
                {userEmail}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Signed In</p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowUpOnSquareIcon className="w-5 h-5 mr-3" />
          <span>{shareText}</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors mt-1"
        >
          <LogoutIcon className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;