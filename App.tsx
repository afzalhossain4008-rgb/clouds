
import React, { useState, useMemo } from 'react';
import { Calculator } from './components/Calculator';
import { Transactions } from './components/Transactions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Transaction, TransactionType } from './types';

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [calculatorResult, setCalculatorResult] = useState<string>('0');

  const handleSaveTransaction = (amount: number, description: string, type: TransactionType) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      description,
      type,
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const { totalEarn, totalExpense, balance } = useMemo(() => {
    const totalEarn = transactions
      .filter(t => t.type === TransactionType.EARN)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalEarn - totalExpense;
    return { totalEarn, totalExpense, balance };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="lg:order-2">
          <Transactions
            transactions={transactions}
            onSaveTransaction={handleSaveTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            balance={balance}
            totalEarn={totalEarn}
            totalExpense={totalExpense}
            initialAmount={calculatorResult}
          />
        </div>
        <div className="lg:order-1">
          <Calculator onResultChange={setCalculatorResult} />
        </div>
      </main>
    </div>
  );
};

export default App;
