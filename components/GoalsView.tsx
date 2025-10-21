import React from 'react';
import { Goal } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { FlagIcon } from './icons/FlagIcon';
import { GoalItem } from './GoalItem';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoalProgress: (goal: Goal) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ goals, onAddGoal, onEditGoal, onDeleteGoal, onUpdateGoalProgress }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Financial Goals</h1>
        <button
          onClick={onAddGoal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.length > 0 ? (
            goals.map(goal => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                onUpdateProgress={onUpdateGoalProgress}
              />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <FlagIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">No goals created yet.</p>
              <p className="text-gray-500 dark:text-gray-400">Click "Add Goal" to start saving for something important.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default GoalsView;