import React, { useState } from 'react';
import { Categories, TransactionType, CategoryEditTarget } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { XIcon } from './icons/XIcon';
import AddCategoryModal from './AddCategoryModal';
import { PencilIcon } from './icons/PencilIcon';

interface CategoriesViewProps {
  categories: Categories;
  addCategory: (name: string, type: TransactionType) => void;
  deleteCategory: (name: string, type: TransactionType) => void;
  onEditCategory: (category: CategoryEditTarget) => void;
}

const CategoryList: React.FC<{
  title: string;
  categories: string[];
  type: TransactionType;
  onDelete: (name: string, type: TransactionType) => void;
  onEdit: (category: CategoryEditTarget) => void;
}> = ({ title, categories, type, onDelete, onEdit }) => (
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">{title}</h2>
    <div className="space-y-2">
      {categories.length > 0 ? (
        categories.map(category => (
          <div key={category} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <span className="text-gray-800 dark:text-gray-200">{category}</span>
            <div className="flex items-center gap-2">
                <button
                onClick={() => onEdit({ name: category, type })}
                className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                aria-label={`Edit ${category}`}
                >
                <PencilIcon className="w-5 h-5" />
                </button>
                <button
                onClick={() => onDelete(category, type)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                aria-label={`Delete ${category}`}
                >
                <XIcon className="w-5 h-5" />
                </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">No categories added yet.</p>
      )}
    </div>
  </div>
);

const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, addCategory, deleteCategory, onEditCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryList
          title="Income Categories"
          categories={categories.INCOME}
          type={TransactionType.INCOME}
          onDelete={deleteCategory}
          onEdit={onEditCategory}
        />
        <CategoryList
          title="Expense Categories"
          categories={categories.EXPENSE}
          type={TransactionType.EXPENSE}
          onDelete={deleteCategory}
          onEdit={onEditCategory}
        />
      </div>

      {isModalOpen && (
        <AddCategoryModal
          onClose={() => setIsModalOpen(false)}
          onAddCategory={addCategory}
        />
      )}
    </div>
  );
};

export default CategoriesView;