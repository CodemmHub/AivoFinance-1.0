import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import AIAssistant from './components/AIAssistant';
import WalletsView from './components/WalletsView';
import CategoriesView from './components/CategoriesView';
import DebtsView from './components/DebtsView';
import SubscriptionsView from './components/SubscriptionsView';
import AssetsView from './components/AssetsView';
import FixedDepositsView from './components/FixedDepositsView';
import ChecksView from './components/ChecksView';
import BudgetsView from './components/BudgetsView';
import GoalsView from './components/GoalsView';
import ReportsView from './components/ReportsView';
import { FABMenu } from './components/FABMenu';
import { useGoogleDriveData } from './context/GoogleDriveDataContext';
import { Spinner } from './components/Spinner';
import { Transaction, Wallet, Debt, Subscription, Asset, FixedDeposit, Check, Budget, Goal, CategoryEditTarget, TransactionType, SubscriptionType, AssetPurchaseType, FixedDepositPurchaseType, DebtType, CheckStatus } from './types';
import { calculateNetWorth } from './utils/calculations';

// Modal Imports
import AddTransactionModal from './components/AddTransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import AddWalletModal from './components/AddWalletModal';
import EditWalletModal from './components/EditWalletModal';
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import AddDebtModal from './components/AddDebtModal';
import EditDebtModal from './components/EditDebtModal';
import AddSubscriptionModal from './components/AddSubscriptionModal';
import EditSubscriptionModal from './components/EditSubscriptionModal';
import AddAssetModal from './components/AddAssetModal';
import EditAssetModal from './components/EditAssetModal';
import AddFixedDepositModal from './components/AddFixedDepositModal';
import EditFixedDepositModal from './components/EditFixedDepositModal';
import AddCheckModal from './components/AddCheckModal';
import AddBudgetModal from './components/AddBudgetModal';
import EditBudgetModal from './components/EditBudgetModal';
import AddGoalModal from './components/AddGoalModal';
import EditGoalModal from './components/EditGoalModal';
import UpdateGoalModal from './components/UpdateGoalModal';
import AddTransferModal from './components/AddTransferModal';


interface AppProps {
  userEmail: string;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ userEmail, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { appData, saveData, isLoading, isSaving } = useGoogleDriveData();

  // Modal States
  const [modal, setModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const netWorth = useMemo(() => {
    if (!appData) return 0;
    return calculateNetWorth(
      appData.wallets,
      appData.transactions,
      appData.debts,
      appData.assets,
      appData.fixedDeposits,
      appData.settings.baseCurrency
    );
  }, [appData]);

  if (isLoading || !appData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  // A generic function to handle adding any new item
  const addItem = (item: any, itemType: keyof Omit<typeof appData, 'settings' | 'version' | 'currencies'>) => {
    const newItem = { ...item, id: uuidv4() };
    const updatedData = { ...appData, [itemType]: [...(appData[itemType] as any[]), newItem] };
    saveData(updatedData);
  };
  
  // A generic function to handle updating any item
  const handleUpdateItem = (updatedItem: any, itemType: keyof typeof appData) => {
      if (itemType === 'settings' || itemType === 'version') return;
      const items = (appData[itemType] as any[]).map(item => item.id === updatedItem.id ? updatedItem : item);
      const updatedData = { ...appData, [itemType]: items };
      saveData(updatedData);
  };

  // A generic function to handle deleting any item
  const handleDeleteItem = (id: string, itemType: keyof typeof appData) => {
      if (itemType === 'settings' || itemType === 'version') return;
      const items = (appData[itemType] as any[]).filter(item => item.id !== id);
      const updatedData = { ...appData, [itemType]: items };
      saveData(updatedData);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Omit<Transaction, 'id'> = {
      ...transaction,
      date: new Date().toISOString()
    }
    addItem(newTransaction, 'transactions');
  }

  const addWallet = (wallet: Omit<Wallet, 'id'>) => {
    const newWallet = { ...wallet, id: uuidv4() };
    const updatedData = { ...appData };
    updatedData.wallets = [...updatedData.wallets, newWallet];

    if (!updatedData.currencies.includes(wallet.currency)) {
        updatedData.currencies = [...updatedData.currencies, wallet.currency].sort();
    }
    saveData(updatedData);
  };

  const addDebt = (debt: Omit<Debt, 'id'>, walletId?: string) => {
    const newDebt = { ...debt, id: uuidv4() };
    const updatedData = { ...appData };
    updatedData.debts = [...updatedData.debts, newDebt];

    if (debt.currency && !updatedData.currencies.includes(debt.currency)) {
      updatedData.currencies = [...updatedData.currencies, debt.currency].sort();
    }
    
    // If it's a new debt from a wallet, create a corresponding transaction
    if (debt.type === DebtType.CURRENT && walletId) {
        const transaction: Omit<Transaction, 'id' | 'date'> = {
            description: `Loan: ${debt.description}`,
            amount: debt.amount,
            type: TransactionType.EXPENSE,
            category: 'Debt',
            walletId,
            remarks: `Lender: ${debt.lender}`,
            originalAmount: debt.originalAmount,
            currency: debt.currency
        };
        const newTransaction = { ...transaction, id: uuidv4(), date: new Date().toISOString() };
        updatedData.transactions = [...updatedData.transactions, newTransaction];
    }

    saveData(updatedData);
  };

  const handleUpdateTransaction = (transaction: Transaction) => handleUpdateItem(transaction, 'transactions');
  const handleDeleteTransaction = (id: string) => handleDeleteItem(id, 'transactions');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard transactions={appData.transactions} wallets={appData.wallets} debts={appData.debts} assets={appData.assets} fixedDeposits={appData.fixedDeposits} checks={appData.checks} />;
      case 'transactions': return <TransactionsView transactions={appData.transactions} wallets={appData.wallets} onEditTransaction={(t) => { setEditingItem(t); setModal('edit_transaction'); }} onDeleteTransaction={handleDeleteTransaction} />;
      case 'ai_assistant': 
        const aiAssistantData = { ...appData, netWorth };
        return <AIAssistant wallets={appData.wallets} categories={appData.categories} onAddTransaction={handleAddTransaction} allData={aiAssistantData} />;
      case 'wallets': return <WalletsView wallets={appData.wallets} transactions={appData.transactions} onAddWallet={() => setModal('add_wallet')} onEditWallet={(w) => { setEditingItem(w); setModal('edit_wallet'); }} onDeleteWallet={(id) => handleDeleteItem(id, 'wallets')} />;
      case 'categories': return <CategoriesView categories={appData.categories} addCategory={() => {}} deleteCategory={() => {}} onEditCategory={(c) => { setEditingItem(c); setModal('edit_category'); }} />;
      case 'debts': return <DebtsView debts={appData.debts} onAddDebt={() => setModal('add_debt')} onEditDebt={(d) => { setEditingItem(d); setModal('edit_debt'); }} onDeleteDebt={(id) => handleDeleteItem(id, 'debts')} />;
      case 'subscriptions': return <SubscriptionsView subscriptions={appData.subscriptions} onAddSubscription={() => setModal('add_subscription')} onPaySubscription={()=>{}} onDeleteSubscription={(id) => handleDeleteItem(id, 'subscriptions')} onEditSubscription={(s) => { setEditingItem(s); setModal('edit_subscription'); }} />;
      case 'assets': return <AssetsView assets={appData.assets} onAddAsset={() => setModal('add_asset')} onEditAsset={(a) => { setEditingItem(a); setModal('edit_asset'); }} onDeleteAsset={(id) => handleDeleteItem(id, 'assets')} />;
      case 'fixed_deposits': return <FixedDepositsView fixedDeposits={appData.fixedDeposits} onAddFixedDeposit={() => setModal('add_fd')} onEditFixedDeposit={(fd) => { setEditingItem(fd); setModal('edit_fd'); }} onDeleteFixedDeposit={(id) => handleDeleteItem(id, 'fixedDeposits')} />;
      case 'checks': return <ChecksView checks={appData.checks} wallets={appData.wallets} onAddCheck={() => setModal('add_check')} onUpdateCheckStatus={() => {}} />;
      case 'budgets': return <BudgetsView budgets={appData.budgets} transactions={appData.transactions} categories={appData.categories.EXPENSE} onAddBudget={() => setModal('add_budget')} onEditBudget={(b) => { setEditingItem(b); setModal('edit_budget'); }} onDeleteBudget={(id) => handleDeleteItem(id, 'budgets')} />;
      case 'goals': return <GoalsView goals={appData.goals} onAddGoal={() => setModal('add_goal')} onEditGoal={(g) => { setEditingItem(g); setModal('edit_goal'); }} onDeleteGoal={(id) => handleDeleteItem(id, 'goals')} onUpdateGoalProgress={(g) => { setEditingItem(g); setModal('update_goal'); }} />;
      case 'reports': return <ReportsView transactions={appData.transactions} wallets={appData.wallets} debts={appData.debts} assets={appData.assets} fixedDeposits={appData.fixedDeposits} />;
      default: return <Dashboard transactions={appData.transactions} wallets={appData.wallets} debts={appData.debts} assets={appData.assets} fixedDeposits={appData.fixedDeposits} checks={appData.checks} />;
    }
  };

  const closeModal = () => {
    setModal(null);
    setEditingItem(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <Sidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={onLogout}
        userEmail={userEmail}
      />
      <main className="flex-1 p-6 overflow-y-auto relative">
        {renderView()}
        <FABMenu 
          onAddTransaction={() => setModal('add_transaction')}
          onAddTransfer={() => setModal('add_transfer')}
          onAddDebt={() => setModal('add_debt')}
          onAddSubscription={() => setModal('add_subscription')}
          onAddCheck={() => setModal('add_check')}
        />
      </main>

      {/* Modals */}
      {modal === 'add_transaction' && <AddTransactionModal onClose={closeModal} onAddTransaction={handleAddTransaction} wallets={appData.wallets} categories={appData.categories} />}
      {modal === 'edit_transaction' && editingItem && <EditTransactionModal onClose={closeModal} onUpdateTransaction={handleUpdateTransaction} transaction={editingItem} wallets={appData.wallets} categories={appData.categories} />}
      {modal === 'add_wallet' && <AddWalletModal onClose={closeModal} onAddWallet={addWallet} currencies={appData.currencies} />}
      {modal === 'edit_wallet' && editingItem && <EditWalletModal onClose={closeModal} onUpdateWallet={(w) => handleUpdateItem(w, 'wallets')} wallet={editingItem} />}
      {modal === 'add_debt' && <AddDebtModal onClose={closeModal} onAddDebt={addDebt} currencies={appData.currencies} wallets={appData.wallets} />}
      {modal === 'edit_debt' && editingItem && <EditDebtModal onClose={closeModal} onUpdateDebt={(d) => handleUpdateItem(d, 'debts')} debt={editingItem} currencies={appData.currencies} />}

      {isSaving && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          Saving...
        </div>
      )}
    </div>
  );
};

export default App;