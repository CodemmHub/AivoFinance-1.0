import React, { useMemo } from 'react';
import { Subscription } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { SubscriptionItem } from './SubscriptionItem';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
  onAddSubscription: () => void;
  onPaySubscription: (subscription: Subscription) => void;
  onDeleteSubscription: (id: string) => void;
  onEditSubscription: (subscription: Subscription) => void;
}

const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ subscriptions, onAddSubscription, onPaySubscription, onDeleteSubscription, onEditSubscription }) => {
  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());
  }, [subscriptions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Subscriptions</h1>
        <button
          onClick={onAddSubscription}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Subscription
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <div className="space-y-2">
          {sortedSubscriptions.length > 0 ? (
            sortedSubscriptions.map(sub => (
              <SubscriptionItem
                key={sub.id}
                subscription={sub}
                onPaySubscription={onPaySubscription}
                onDeleteSubscription={onDeleteSubscription}
                onEditSubscription={onEditSubscription}
              />
            ))
          ) : (
            <div className="text-center py-16">
                <CalendarDaysIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">No subscriptions found.</p>
                <p className="text-gray-500 dark:text-gray-400">Click "Add Subscription" to track your recurring payments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsView;