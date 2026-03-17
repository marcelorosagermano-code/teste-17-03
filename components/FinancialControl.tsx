import React, { useState } from 'react';
import { Plus, Minus, DollarSign, Tag, Calendar, Trash2, Wallet, TrendingUp, TrendingDown, Calculator, PieChart, FileText } from 'lucide-react';
import { FinancialRecord, User } from '../types';
import { PricingCalculator } from './PricingCalculator';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FinancialControlProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const FinancialControl: React.FC<FinancialControlProps> = ({ user, onUpdateUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'calculator'>('records');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const amount = (parseInt(digits) / 100).toFixed(2);
    return amount.replace('.', ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
  };

  const incomeCategories = ['Venda de Peça', 'Conserto', 'Aula Particular', 'Outros'];
  const expenseCategories = ['Tecidos', 'Linhas', 'Aviamentos', 'Manutenção de Máquina', 'Energia/Aluguel', 'Outros'];

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!numericAmount || !category) return;

    const newRecord: FinancialRecord = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      category,
      description,
      amount: numericAmount,
      date,
    };

    const currentStats = user.stats || {
      completedLessons: [],
      totalSales: 0,
      monthlySales: [],
      financialRecords: [],
      clients: [],
      orders: [],
      portfolio: [],
      goals: { monthly: 0, current: 0 }
    };

    const updatedRecords = [newRecord, ...(currentStats.financialRecords || [])];
    
    // Calculate new totals
    const newTotalIncome = updatedRecords.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
    const newTotalExpense = updatedRecords.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
    const newBalance = newTotalIncome - newTotalExpense;

    const updatedUser = {
      ...user,
      stats: {
        ...currentStats,
        totalSales: newTotalIncome, // totalSales tracks total revenue
        financialRecords: updatedRecords,
        goals: {
          ...currentStats.goals,
          current: newBalance // goals.current tracks profit
        }
      },
    };

    onUpdateUser(updatedUser);
    setCategory('');
    setDescription('');
    setAmount('');
  };

  const handleDeleteRecord = (id: string) => {
    if (!user.stats) return;

    const recordToDelete = user.stats.financialRecords.find(r => r.id === id);
    const updatedRecords = user.stats.financialRecords.filter(r => r.id !== id);
    
    // Calculate new totals
    const newTotalIncome = updatedRecords.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
    const newTotalExpense = updatedRecords.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
    const newBalance = newTotalIncome - newTotalExpense;

    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        totalSales: newTotalIncome,
        financialRecords: updatedRecords,
        goals: {
          ...user.stats.goals,
          current: newBalance
        }
      },
    };

    onUpdateUser(updatedUser);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });

    // Filter records for current month
    const monthlyRecords = (user.stats?.financialRecords || []).filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyRecords.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
    const monthlyExpense = monthlyRecords.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
    const monthlyBalance = monthlyIncome - monthlyExpense;

    // Filter completed orders for productivity
    const completedOrders = (user.stats?.orders || []).filter(o => {
      // Check if order was delivered/finalized this month
      // Using deliveryDate as proxy for completion if status is delivered, or just checking status
      // A better way would be checking history, but let's use deliveryDate for simplicity if status is finalized/delivered
      const isCompleted = o.status === 'finalizado' || o.status === 'entregue';
      const orderDate = new Date(o.deliveryDate); // Or createdAt? Let's use deliveryDate as "completion target"
      return isCompleted && orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    // Header
    doc.setFontSize(22);
    doc.setTextColor(225, 29, 72); // Brand color
    doc.text('Atelier Kids', 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(`Relatório Mensal - ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}/${currentYear}`, 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${currentDate.toLocaleDateString('pt-BR')} às ${currentDate.toLocaleTimeString('pt-BR')}`, 14, 36);

    // Financial Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo Financeiro', 14, 50);

    const summaryData = [
      ['Entradas', `R$ ${monthlyIncome.toFixed(2)}`],
      ['Saídas', `R$ ${monthlyExpense.toFixed(2)}`],
      ['Lucro Líquido', `R$ ${monthlyBalance.toFixed(2)}`]
    ];

    autoTable(doc, {
      startY: 55,
      head: [['Categoria', 'Valor']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [225, 29, 72] },
    });

    // Productivity Summary
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Produtividade', 14, finalY);
    
    const productivityData = [
      ['Pedidos Finalizados/Entregues', completedOrders.length.toString()],
      ['Valor Total dos Pedidos', `R$ ${completedOrders.reduce((acc, o) => acc + o.value, 0).toFixed(2)}`]
    ];

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Métrica', 'Valor']],
      body: productivityData,
      theme: 'striped',
      headStyles: { fillColor: [80, 80, 80] },
    });

    // Detailed Transactions
    const transactionsY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Detalhamento de Transações', 14, transactionsY);

    const transactionRows = monthlyRecords.map(r => [
      new Date(r.date).toLocaleDateString('pt-BR'),
      r.category,
      r.description || '-',
      r.type === 'income' ? 'Entrada' : 'Saída',
      `R$ ${r.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: transactionsY + 5,
      head: [['Data', 'Categoria', 'Descrição', 'Tipo', 'Valor']],
      body: transactionRows,
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40] },
      columnStyles: {
        4: { halign: 'right' }
      }
    });

    doc.save(`relatorio-atelier-${monthName}-${currentYear}.pdf`);
  };

  const records = user.stats?.financialRecords || [];
  const totalIncome = records.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Financeiro</h1>
          <p className="text-zinc-500 dark:text-zinc-500">Gerencie seus lucros e calcule preços justos.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 dark:bg-zinc-700 text-white rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-all font-bold text-sm shadow-sm"
            title="Baixar Relatório Mensal (PDF)"
          >
            <FileText size={18} />
            <span className="hidden md:inline">Relatório Mensal</span>
          </button>
          
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveSubTab('records')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeSubTab === 'records' ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <PieChart size={18} /> <span className="hidden md:inline">Lançamentos</span>
            </button>
            <button
              onClick={() => setActiveSubTab('calculator')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeSubTab === 'calculator' ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Calculator size={18} /> <span className="hidden md:inline">Calculadora</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'records' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Saldo Total</span>
                <Wallet className="text-brand-500" size={18} />
              </div>
              <div className={`text-2xl font-black ${balance >= 0 ? 'text-zinc-900 dark:text-white' : 'text-rose-500'}`}>
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Entradas</span>
                <TrendingUp className="text-emerald-500" size={18} />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-500">
                + R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Saídas</span>
                <TrendingDown className="text-rose-500" size={18} />
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-500">
                - R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Novo Lançamento</h3>
            </div>

            <div className="p-6">
              <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tipo</label>
                  <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        type === 'income' ? 'bg-emerald-500 text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                      }`}
                    >
                      <TrendingUp size={14} /> Entrada
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        type === 'expense' ? 'bg-rose-500 text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                      }`}
                    >
                      <TrendingDown size={14} /> Saída
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                    required
                  >
                    <option value="">Selecionar...</option>
                    {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Valor (R$)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0,00"
                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Descrição (Opcional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Vestido Maria"
                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  <Plus size={18} /> Adicionar
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Últimos Lançamentos</h4>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-500">{records.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-950/50">
                    <th className="p-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">Data</th>
                    <th className="p-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">Categoria</th>
                    <th className="p-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">Descrição</th>
                    <th className="p-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">Valor</th>
                    <th className="p-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500 dark:text-zinc-500 text-sm italic">
                        Nenhum lançamento registrado ainda.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                          {new Date(record.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            record.type === 'income' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-rose-500/10 text-rose-600 dark:text-rose-500'
                          }`}>
                            {record.category}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300">{record.description || '-'}</td>
                        <td className={`p-4 text-sm font-bold ${
                          record.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'
                        }`}>
                          {record.type === 'income' ? '+' : '-'} R$ {record.amount.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="p-1.5 text-zinc-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <PricingCalculator />
      )}
    </div>
  );
};
