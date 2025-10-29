
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { PlusIcon, ArrowDownIcon, ArrowUpIcon, TrashIcon } from './Icons';

interface TransactionsProps {
  transactions: Transaction[];
  onSaveTransaction: (amount: number, description: string, type: TransactionType) => void;
  onDeleteTransaction: (id: string) => void;
  balance: number;
  totalEarn: number;
  totalExpense: number;
  initialAmount: string;
}

const StatCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; colorClass: string }> = ({ title, amount, icon, colorClass }) => (
  <div className={`bg-gray-800 p-4 rounded-xl flex items-center space-x-4`}>
    <div className={`p-2 rounded-full ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xl font-bold">${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  </div>
);

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  onSaveTransaction,
  onDeleteTransaction,
  balance,
  totalEarn,
  totalExpense,
  initialAmount
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

  useEffect(() => {
    const numAmount = parseFloat(initialAmount);
    if (!isNaN(numAmount)) {
      setAmount(String(Math.abs(numAmount)));
      if (numAmount < 0) {
        setType(TransactionType.EXPENSE);
      } else {
        setType(TransactionType.EARN);
      }
    }
  }, [initialAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || !description) return;
    onSaveTransaction(numAmount, description, type);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="bg-gray-800/50 rounded-3xl p-4 sm:p-6 shadow-2xl w-full flex flex-col space-y-6 h-full max-h-[85vh]">
      <div className="text-center">
        <p className="text-gray-400 text-sm">Current Balance</p>
        <p className={`text-4xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Earned" amount={totalEarn} icon={<ArrowUpIcon />} colorClass="bg-green-500/20 text-green-400" />
        <StatCard title="Spent" amount={totalExpense} icon={<ArrowDownIcon />} colorClass="bg-red-500/20 text-red-400" />
      </div>

      <div className="flex-grow flex flex-col bg-gray-900 rounded-2xl p-4 min-h-0">
        <h3 className="text-lg font-semibold mb-4 text-gray-300">Recent Transactions</h3>
        <div className="overflow-y-auto flex-grow pr-2 space-y-3">
          {transactions.length > 0 ? (
            transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${t.type === TransactionType.EARN ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {t.type === TransactionType.EARN ? <ArrowUpIcon className="text-green-400" /> : <ArrowDownIcon className="text-red-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-white">{t.description}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <p className={`font-bold ${t.type === TransactionType.EARN ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === TransactionType.EARN ? '+' : '-'}${t.amount.toLocaleString('en-US')}
                  </p>
                  <button onClick={() => onDeleteTransaction(t.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">No transactions yet.</p>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">Add Transaction</h3>
        <div className="flex items-center space-x-2 mb-3">
          <button type="button" onClick={() => setType(TransactionType.EARN)} className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${type === TransactionType.EARN ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
            Earn
          </button>
          <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
            Expense
          </button>
        </div>
        <div className="flex space-x-2">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-1/3 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="flex-grow bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg flex items-center justify-center transition-colors">
                <PlusIcon />
            </button>
        </div>
      </form>
    </div>
  );
};
