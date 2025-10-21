import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import AIAssistant from './components/AIAssistant';
import AddTransactionModal from './components/AddTransactionModal';
import { Transaction, Wallet, Categories, TransactionType, Debt, Subscription, BillingCycle, Asset, FixedDeposit, DebtType, AssetType, AssetPurchaseType, FixedDepositPurchaseType, SubscriptionType, Check, CheckStatus, CategoryEditTarget, Budget, Goal, AppData } from './types';
import WalletsView from './components/WalletsView';
import AddWalletModal from './components/AddWalletModal';
import CategoriesView from './components/CategoriesView';
import AddCategoryModal from './components/AddCategoryModal';
import DebtsView from './components/DebtsView';
import AddDebtModal from './components/AddDebtModal';
import SubscriptionsView from './components/SubscriptionsView';
import AddSubscriptionModal from './components/AddSubscriptionModal';
import AssetsView from './components/AssetsView';
import AddAssetModal from './components/AddAssetModal';
import FixedDepositsView from './components/FixedDepositsView';
import AddFixedDepositModal from './components/AddFixedDepositModal';
import AddTransferModal from './components/AddTransferModal';
import { FABMenu } from './components/FABMenu';
import ChecksView from './components/ChecksView';
import AddCheckModal from './components/AddCheckModal';
import EditTransactionModal from './components/EditTransactionModal';
import EditWalletModal from './components/EditWalletModal';
import EditDebtModal from './components/EditDebtModal';
import EditSubscriptionModal from './components/EditSubscriptionModal';
import EditAssetModal from './components/EditAssetModal';
import EditFixedDepositModal from './components/EditFixedDepositModal';
import EditCategoryModal from './components/EditCategoryModal';
import ReportsView from './components/ReportsView';
import BudgetsView from './components/BudgetsView';
import GoalsView from './components/GoalsView';
import AddBudgetModal from './components/AddBudgetModal';
import EditBudgetModal from './components/EditBudgetModal';
import AddGoalModal from './components/AddGoalModal';
import EditGoalModal from './components/EditGoalModal';
import UpdateGoalModal from './components/UpdateGoalModal';
import { calculateNetWorth } from './utils/calculations';
import { useGoogleDriveData } from './context/GoogleDriveDataContext';

interface AppProps {
  userEmail: string;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ userEmail, onLogout }) => {
  const { data, updateData, baseCurrency } = useGoogleDriveData();
  const { transactions, wallets, categories, debts, subscriptions, assets, fixedDeposits, checks, budgets, goals } = data;

  const [currentView, setCurrentView] = useState('dashboard');
  
  // Add Modal states
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [isAddWalletModalOpen, setAddWalletModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [isAddDebtModalOpen, setAddDebtModalOpen] = useState(false);
  const [isAddSubscriptionModalOpen, setAddSubscriptionModalOpen] = useState(false);
  const [isAddAssetModalOpen, setAddAssetModalOpen] = useState(false);
  const [isAddFixedDepositModalOpen, setAddFixedDepositModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [isAddCheckModalOpen, setAddCheckModalOpen] = useState(false);
  const [isAddBudgetModalOpen, setAddBudgetModalOpen] = useState(false);
  const [isAddGoalModalOpen, setAddGoalModalOpen] = useState(false);
  
  // Edit Modal states
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [walletToEdit, setWalletToEdit] = useState<Wallet | null>(null);
  const [debtToEdit, setDebtToEdit] = useState<Debt | null>(null);
  const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [fixedDepositToEdit, setFixedDepositToEdit] = useState<FixedDeposit | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryEditTarget | null>(null);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
  const [goalToUpdate, setGoalToUpdate] = useState<Goal | null>(null);
  
  const setTransactions = (updater: (prev: Transaction[]) => Transaction[]) => {
    updateData({ transactions: updater(transactions) });
  };
  const setWallets = (updater: (prev: Wallet[]) => Wallet[]) => {
    updateData({ wallets: updater(wallets) });
  };
  const setCategories = (updater: (prev: Categories) => Categories) => {
    updateData({ categories: updater(categories) });
  };
  const setDebts = (updater: (prev: Debt[]) => Debt[]) => {
    updateData({ debts: updater(debts) });
  };
  const setSubscriptions = (updater: (prev: Subscription[]) => Subscription[]) => {
    updateData({ subscriptions: updater(subscriptions) });
  };
  const setAssets = (updater: (prev: Asset[]) => Asset[]) => {
    updateData({ assets: updater(assets) });
  };
  const setFixedDeposits = (updater: (prev: FixedDeposit[]) => FixedDeposit[]) => {
    updateData({ fixedDeposits: updater(fixedDeposits) });
  };
  const setChecks = (updater: (prev: Check[]) => Check[]) => {
    updateData({ checks: updater(checks) });
  };
  const setBudgets = (updater: (prev: Budget[]) => Budget[]) => {
    updateData({ budgets: updater(budgets) });
  };
  const setGoals = (updater: (prev: Goal[]) => Goal[]) => {
    updateData({ goals: updater(goals) });
  };
  
  // --- CRUD Handlers ---

  // Transactions
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    setTransactionToEdit(null);
  };
  const deleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // Wallets
  const addWallet = (wallet: Omit<Wallet, 'id'>) => {
    setWallets(prev => [...prev, { ...wallet, id: new Date().toISOString() + Math.random() }]);
  };
  const updateWallet = (updatedWallet: Wallet) => {
    setWallets(prev => prev.map(w => w.id === updatedWallet.id ? updatedWallet : w));
    setWalletToEdit(null);
  };
  const deleteWallet = (id: string) => {
    if (wallets.length <= 1) {
        alert("You cannot delete your last wallet. Please add another wallet first.");
        return;
    }
    const isUsed = transactions.some(t => t.walletId === id) || 
                   subscriptions.some(s => s.walletId === id) || 
                   checks.some(c => c.walletId === id);
    if (isUsed) {
      alert("Cannot delete wallet. It is used by transactions, subscriptions, or checks. Please re-assign or delete them first.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this wallet? This action cannot be undone.")) {
      setWallets(prev => prev.filter(w => w.id !== id));
    }
  };
  
  // Categories
  const addCategory = (name: string, type: TransactionType) => {
    setCategories(prev => {
        const newCats = {...prev};
        if (!newCats[type].includes(name)) {
            newCats[type] = [...newCats[type], name];
        }
        return newCats;
    });
  };
  const updateCategory = (oldName: string, newName: string, type: TransactionType) => {
    if (oldName === newName) {
        setCategoryToEdit(null);
        return;
    };

    const newCategories = { ...categories };
    const list = newCategories[type];
    const index = list.indexOf(oldName);
    if (index > -1) {
        list[index] = newName;
    }
    
    const newTransactions = transactions.map(t => (t.type === type && t.category === oldName ? { ...t, category: newName } : t));
    const newSubscriptions = subscriptions.map(s => (s.category === oldName ? { ...s, category: newName } : s));
    const newChecks = checks.map(c => (c.category === oldName ? { ...c, category: newName } : c));
    
    updateData({
        categories: newCategories,
        transactions: newTransactions,
        subscriptions: newSubscriptions,
        checks: newChecks,
    });
    setCategoryToEdit(null);
};
  const deleteCategory = (name: string, type: TransactionType) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"? Existing transactions with this category will not be changed.`)) {
        setCategories(prev => ({...prev, [type]: prev[type].filter(c => c !== name)}));
    }
  };

  // Debts
  const addDebt = (debt: Omit<Debt, 'id'>, walletId?: string) => {
    const newDebt: Debt = { ...debt, id: new Date().toISOString() + Math.random() };
    const newDebts = [newDebt, ...debts];

    if (debt.type === DebtType.CURRENT && walletId) {
        const newTransaction: Transaction = {
            id: new Date().toISOString() + Math.random(),
            date: new Date().toISOString(),
            description: `Loan from ${debt.lender}`, amount: debt.amount, type: TransactionType.INCOME,
            category: 'Loan', walletId, originalAmount: debt.originalAmount, currency: debt.currency,
            exchangeRate: debt.exchangeRate, remarks: debt.remarks,
        };
        updateData({ debts: newDebts, transactions: [newTransaction, ...transactions] });
    } else {
        updateData({ debts: newDebts });
    }
  };
  const updateDebt = (updatedDebt: Debt) => {
    setDebts(prev => prev.map(d => d.id === updatedDebt.id ? updatedDebt : d));
    setDebtToEdit(null);
  };
  const deleteDebt = (id: string) => {
    if (window.confirm('Are you sure? Deleting a debt will not affect any associated income transactions.')) {
        setDebts(prev => prev.filter(d => d.id !== id));
    }
  };

  // Subscriptions
  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = { ...subscription, id: new Date().toISOString() + Math.random() };
    const newSubscriptions = [newSubscription, ...subscriptions];
    
    if (subscription.type === SubscriptionType.NEW) {
        const newTransaction: Transaction = {
            id: new Date().toISOString() + Math.random(),
            date: new Date().toISOString(),
            description: `Initial payment for ${subscription.name}`, amount: subscription.amount,
            type: TransactionType.EXPENSE, category: subscription.category, walletId: subscription.walletId,
            remarks: subscription.remarks,
        };
        updateData({ subscriptions: newSubscriptions, transactions: [newTransaction, ...transactions] });
    } else {
        updateData({ subscriptions: newSubscriptions });
    }
  };
  const updateSubscription = (updatedSub: Subscription) => {
      setSubscriptions(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
      setSubscriptionToEdit(null);
  };
  const paySubscription = (sub: Subscription) => {
    const newTransaction: Transaction = {
        id: new Date().toISOString() + Math.random(),
        date: new Date().toISOString(),
        description: `Payment for ${sub.name}`, amount: sub.amount, type: TransactionType.EXPENSE,
        category: sub.category, walletId: sub.walletId,
    };
    
    const nextDueDate = new Date(sub.nextDueDate);
    if (sub.billingCycle === BillingCycle.MONTHLY) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    } else {
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
    }
    const updatedSubscriptions = subscriptions.map(s => s.id === sub.id ? {...s, nextDueDate: nextDueDate.toISOString()} : s);
    
    updateData({
        transactions: [newTransaction, ...transactions],
        subscriptions: updatedSubscriptions
    });
  };
  const deleteSubscription = (id: string) => {
      if (window.confirm('Are you sure you want to delete this subscription?')) {
        setSubscriptions(subs => subs.filter(s => s.id !== id));
      }
  };

  // Assets
  const addAsset = (asset: Omit<Asset, 'id'>, walletId?: string) => {
    const newAsset: Asset = { ...asset, id: new Date().toISOString() + Math.random() };
    const newAssets = [newAsset, ...assets];

    if (asset.purchaseType === AssetPurchaseType.CURRENT && walletId) {
        const newTransaction: Transaction = {
            id: new Date().toISOString() + Math.random(),
            date: new Date().toISOString(),
            description: `Purchase of ${asset.name}`, amount: asset.currentValue,
            type: TransactionType.EXPENSE, category: 'Investment', walletId, remarks: asset.remarks,
        };
        updateData({ assets: newAssets, transactions: [newTransaction, ...transactions] });
    } else {
        updateData({ assets: newAssets });
    }
  };
  const updateAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    setAssetToEdit(null);
  };
  const deleteAsset = (id: string) => {
    if (window.confirm('Are you sure? Deleting an asset will not affect any associated expense transactions.')) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };
  
  // Fixed Deposits
  const addFixedDeposit = (fd: Omit<FixedDeposit, 'id'>, walletId?: string) => {
    const newFd: FixedDeposit = { ...fd, id: new Date().toISOString() + Math.random() };
    const newFds = [newFd, ...fixedDeposits];

    if (fd.purchaseType === FixedDepositPurchaseType.CURRENT && walletId) {
        const newTransaction: Transaction = {
            id: new Date().toISOString() + Math.random(),
            date: new Date().toISOString(),
            description: `Fixed Deposit at ${fd.bankName}`, amount: fd.principalAmount,
            type: TransactionType.EXPENSE, category: 'Investment', walletId, remarks: fd.remarks,
        };
        updateData({ fixedDeposits: newFds, transactions: [newTransaction, ...transactions] });
    } else {
        updateData({ fixedDeposits: newFds });
    }
  };
  const updateFixedDeposit = (updatedFd: FixedDeposit) => {
    setFixedDeposits(prev => prev.map(fd => fd.id === updatedFd.id ? updatedFd : fd));
    setFixedDepositToEdit(null);
  };
  const deleteFixedDeposit = (id: string) => {
    if (window.confirm('Are you sure? Deleting a fixed deposit will not affect any associated expense transactions.')) {
      setFixedDeposits(prev => prev.filter(fd => fd.id !== id));
    }
  };
  
  // Transfers
  const handleTransfer = (
    fromWalletId: string, toWalletId: string, fromAmount: number, toAmount: number, 
    fromExchangeRate: number, toExchangeRate: number, remarks: string
  ) => {
    const fromWallet = wallets.find(w => w.id === fromWalletId);
    const toWallet = wallets.find(w => w.id === toWalletId);
    if (!fromWallet || !toWallet) return;
    
    const now = new Date().toISOString();
    
    const expenseTx: Transaction = {
      id: now + Math.random() + 'exp',
      date: now,
      description: `Transfer to ${toWallet.name}`, amount: fromAmount * fromExchangeRate, originalAmount: fromAmount,
      currency: fromWallet.currency, exchangeRate: fromExchangeRate, type: TransactionType.EXPENSE,
      category: 'Transfer', walletId: fromWalletId, remarks,
    };
    const incomeTx: Transaction = {
      id: now + Math.random() + 'inc',
      date: now,
      description: `Transfer from ${fromWallet.name}`, amount: toAmount * toExchangeRate, originalAmount: toAmount,
      currency: toWallet.currency, exchangeRate: toExchangeRate, type: TransactionType.INCOME,
      category: 'Transfer', walletId: toWalletId, remarks,
    };

    setTransactions(prev => [incomeTx, expenseTx, ...prev]);
  };
  
  // Checks
  const addCheck = (check: Omit<Check, 'id' | 'status'>) => {
    const newCheck: Check = { ...check, id: new Date().toISOString() + Math.random(), status: CheckStatus.PENDING };
    setChecks(prev => [newCheck, ...prev]);
  };
  const updateCheckStatus = (checkId: string, newStatus: CheckStatus) => {
    const checkToUpdate = checks.find(c => c.id === checkId);
    if (!checkToUpdate) return;
    
    const updatedChecks = checks.map(c => c.id === checkId ? { ...c, status: newStatus } : c);

    if (newStatus === CheckStatus.CLEARED) {
      const newTransaction: Transaction = {
        id: new Date().toISOString() + Math.random(),
        date: new Date().toISOString(),
        description: `Check #${checkToUpdate.checkNumber} to ${checkToUpdate.payee}`, amount: checkToUpdate.amount,
        type: TransactionType.EXPENSE, category: checkToUpdate.category, walletId: checkToUpdate.walletId,
        remarks: `Check cleared on ${new Date().toLocaleDateString()}`, originalAmount: checkToUpdate.originalAmount,
        currency: checkToUpdate.currency, exchangeRate: checkToUpdate.exchangeRate,
      };
      updateData({ checks: updatedChecks, transactions: [newTransaction, ...transactions] });
    } else {
        updateData({ checks: updatedChecks });
    }
  };
  
  // Budgets
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    setBudgets(prev => [...prev, { ...budget, id: new Date().toISOString() + Math.random() }]);
  };
  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b));
    setBudgetToEdit(null);
  };
  const deleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(prev => prev.filter(b => b.id !== id));
    }
  };

  // Goals
  const addGoal = (goal: Omit<Goal, 'id' | 'savedAmount'>) => {
    setGoals(prev => [...prev, { ...goal, id: new Date().toISOString() + Math.random(), savedAmount: 0 }]);
  };
  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    setGoalToEdit(null);
  };
  const updateGoalProgress = (goalId: string, amount: number) => {
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
            const newSavedAmount = Math.max(0, g.savedAmount + amount);
            return { ...g, savedAmount: newSavedAmount };
        }
        return g;
      }));
      setGoalToUpdate(null);
  }
  const deleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this financial goal?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };


  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} wallets={wallets} debts={debts} assets={assets} fixedDeposits={fixedDeposits} checks={checks} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} wallets={wallets} onEditTransaction={setTransactionToEdit} onDeleteTransaction={deleteTransaction} />;
      case 'wallets':
        return <WalletsView wallets={wallets} transactions={transactions} onAddWallet={() => setAddWalletModalOpen(true)} onEditWallet={setWalletToEdit} onDeleteWallet={deleteWallet} />;
      case 'categories':
        return <CategoriesView categories={categories} addCategory={addCategory} deleteCategory={deleteCategory} onEditCategory={setCategoryToEdit} />;
      case 'debts':
        return <DebtsView debts={debts} onAddDebt={() => setAddDebtModalOpen(true)} onEditDebt={setDebtToEdit} onDeleteDebt={deleteDebt}/>;
      case 'subscriptions':
        return <SubscriptionsView subscriptions={subscriptions} onAddSubscription={() => setAddSubscriptionModalOpen(true)} onPaySubscription={paySubscription} onDeleteSubscription={deleteSubscription} onEditSubscription={setSubscriptionToEdit} />;
      case 'assets':
        return <AssetsView assets={assets} onAddAsset={() => setAddAssetModalOpen(true)} onEditAsset={setAssetToEdit} onDeleteAsset={deleteAsset} />;
      case 'fixed_deposits':
        return <FixedDepositsView fixedDeposits={fixedDeposits} onAddFixedDeposit={() => setAddFixedDepositModalOpen(true)} onEditFixedDeposit={setFixedDepositToEdit} onDeleteFixedDeposit={deleteFixedDeposit} />;
      case 'checks':
        return <ChecksView checks={checks} wallets={wallets} onAddCheck={() => setAddCheckModalOpen(true)} onUpdateCheckStatus={updateCheckStatus} />;
      case 'reports':
        return <ReportsView transactions={transactions} wallets={wallets} debts={debts} assets={assets} fixedDeposits={fixedDeposits} />;
      case 'budgets':
        return <BudgetsView budgets={budgets} transactions={transactions} categories={categories.EXPENSE} onAddBudget={() => setAddBudgetModalOpen(true)} onEditBudget={setBudgetToEdit} onDeleteBudget={deleteBudget} />;
      case 'goals':
        return <GoalsView goals={goals} onAddGoal={() => setAddGoalModalOpen(true)} onEditGoal={setGoalToEdit} onDeleteGoal={deleteGoal} onUpdateGoalProgress={setGoalToUpdate} />;
      case 'ai_assistant':
        return <AIAssistant 
            wallets={wallets} 
            categories={categories} 
            onAddTransaction={addTransaction} 
            allData={{
                transactions, wallets, debts, subscriptions, assets, fixedDeposits, checks, budgets, goals,
                netWorth: calculateNetWorth(wallets, transactions, debts, assets, fixedDeposits, baseCurrency)
            }}
        />;
      default:
        return <Dashboard transactions={transactions} wallets={wallets} debts={debts} assets={assets} fixedDeposits={fixedDeposits} checks={checks} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={onLogout} userEmail={userEmail} />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {renderView()}
      </main>
      
      <FABMenu 
        onAddTransaction={() => setAddTransactionModalOpen(true)}
        onAddTransfer={() => setTransferModalOpen(true)}
        onAddDebt={() => setAddDebtModalOpen(true)}
        onAddSubscription={() => setAddSubscriptionModalOpen(true)}
        onAddCheck={() => setAddCheckModalOpen(true)}
      />

      {/* Add Modals */}
      {isAddTransactionModalOpen && <AddTransactionModal onClose={() => setAddTransactionModalOpen(false)} onAddTransaction={addTransaction} wallets={wallets} categories={categories} />}
      {isAddWalletModalOpen && <AddWalletModal onClose={() => setAddWalletModalOpen(false)} onAddWallet={addWallet} />}
      {isAddCategoryModalOpen && <AddCategoryModal onClose={() => setAddCategoryModalOpen(false)} onAddCategory={addCategory} />}
      {isAddDebtModalOpen && <AddDebtModal onClose={() => setAddDebtModalOpen(false)} onAddDebt={addDebt} wallets={wallets} />}
      {isAddSubscriptionModalOpen && <AddSubscriptionModal onClose={() => setAddSubscriptionModalOpen(false)} onAddSubscription={addSubscription} wallets={wallets} categories={categories.EXPENSE} />}
      {isAddAssetModalOpen && <AddAssetModal onClose={() => setAddAssetModalOpen(false)} onAddAsset={addAsset} wallets={wallets} />}
      {isAddFixedDepositModalOpen && <AddFixedDepositModal onClose={() => setAddFixedDepositModalOpen(false)} onAddFixedDeposit={addFixedDeposit} wallets={wallets} />}
      {isTransferModalOpen && <AddTransferModal onClose={() => setTransferModalOpen(false)} onTransfer={handleTransfer} wallets={wallets} transactions={transactions} />}
      {isAddCheckModalOpen && <AddCheckModal onClose={() => setAddCheckModalOpen(false)} onAddCheck={addCheck} wallets={wallets} categories={categories.EXPENSE} />}
      {isAddBudgetModalOpen && <AddBudgetModal onClose={() => setAddBudgetModalOpen(false)} onAddBudget={addBudget} expenseCategories={categories.EXPENSE} existingBudgets={budgets} />}
      {isAddGoalModalOpen && <AddGoalModal onClose={() => setAddGoalModalOpen(false)} onAddGoal={addGoal} />}
      
      {/* Edit Modals */}
      {transactionToEdit && <EditTransactionModal onClose={() => setTransactionToEdit(null)} onUpdateTransaction={updateTransaction} wallets={wallets} categories={categories} transaction={transactionToEdit} />}
      {walletToEdit && <EditWalletModal onClose={() => setWalletToEdit(null)} onUpdateWallet={updateWallet} wallet={walletToEdit} />}
      {debtToEdit && <EditDebtModal onClose={() => setDebtToEdit(null)} onUpdateDebt={updateDebt} wallets={wallets} debt={debtToEdit} />}
      {subscriptionToEdit && <EditSubscriptionModal onClose={() => setSubscriptionToEdit(null)} onUpdateSubscription={updateSubscription} wallets={wallets} categories={categories.EXPENSE} subscription={subscriptionToEdit} />}
      {assetToEdit && <EditAssetModal onClose={() => setAssetToEdit(null)} onUpdateAsset={updateAsset} wallets={wallets} asset={assetToEdit} />}
      {fixedDepositToEdit && <EditFixedDepositModal onClose={() => setFixedDepositToEdit(null)} onUpdateFixedDeposit={updateFixedDeposit} wallets={wallets} fixedDeposit={fixedDepositToEdit} />}
      {categoryToEdit && <EditCategoryModal onClose={() => setCategoryToEdit(null)} onUpdateCategory={updateCategory} category={categoryToEdit} />}
      {budgetToEdit && <EditBudgetModal onClose={() => setBudgetToEdit(null)} onUpdateBudget={updateBudget} budget={budgetToEdit} expenseCategories={categories.EXPENSE} existingBudgets={budgets} />}
      {goalToEdit && <EditGoalModal onClose={() => setGoalToEdit(null)} onUpdateGoal={updateGoal} goal={goalToEdit} />}
      {goalToUpdate && <UpdateGoalModal onClose={() => setGoalToUpdate(null)} onUpdateProgress={updateGoalProgress} goal={goalToUpdate} />}
    </div>
  );
};

export default App;
