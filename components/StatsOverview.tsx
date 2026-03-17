import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, BookOpen, DollarSign, Award, CheckCircle2, TrendingDown, Wallet } from 'lucide-react';
import { UserStats, Module } from '../types';

interface StatsOverviewProps {
  stats: UserStats;
  modules: Module[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, modules }) => {
  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = stats.completedLessons.length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);

  // Financial Calculations
  const records = stats.financialRecords || [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthRecords = records.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyIncome = currentMonthRecords
    .filter(r => r.type === 'income')
    .reduce((acc, r) => acc + r.amount, 0);

  const monthlyExpenses = currentMonthRecords
    .filter(r => r.type === 'expense')
    .reduce((acc, r) => acc + r.amount, 0);

  const monthlyProfit = monthlyIncome - monthlyExpenses;

  // Prepare chart data from records
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      month: d.toLocaleDateString('pt-BR', { month: 'short' }),
      monthIdx: d.getMonth(),
      year: d.getFullYear(),
      income: 0,
      expense: 0,
      profit: 0
    };
  });

  last6Months.forEach(m => {
    const monthRecords = records.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
    });
    m.income = monthRecords.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
    m.expense = monthRecords.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
    m.profit = m.income - m.expense;
  });

  return (
    <div className="space-y-6">
      {/* Financial Summary Highlight */}
      <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-zinc-900 dark:text-white">
          <Wallet size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] mb-2 block">Resumo Financeiro Mensal</span>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
              Você lucrou <span className="text-emerald-600 dark:text-emerald-500">R$ {monthlyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> este mês
            </h3>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-1">Parabéns! Seu atelier está crescendo de forma saudável.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-white/5">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase font-bold block mb-1">Entradas</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-500">R$ {monthlyIncome.toFixed(2)}</span>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-white/5">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase font-bold block mb-1">Saídas</span>
              <span className="text-lg font-black text-rose-600 dark:text-rose-500">R$ {monthlyExpenses.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm transition-colors duration-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-500">
              <BookOpen size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Progresso</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white">{progressPercentage}%</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">{completedCount} de {totalLessons} aulas</p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm transition-colors duration-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-500">
              <DollarSign size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Vendas Totais</span>
          </div>
          <h4 className="text-2xl font-black text-zinc-900 dark:text-white">R$ {stats.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> +12% este mês
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm transition-colors duration-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-500">
              <Award size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Nível</span>
          </div>
          <h4 className="text-2xl font-black text-zinc-900 dark:text-white">Costureira Pro</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Próximo: Mestra das Agulhas</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm transition-colors duration-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-500">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Conquistas</span>
          </div>
          <h4 className="text-2xl font-black text-zinc-900 dark:text-white">8 / 15</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">3 novas esta semana</p>
        </div>
      </div>

      {/* Financial Evolution Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm transition-colors duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Evolução Financeira</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">Faturamento, Custos e Lucro nos últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Faturamento
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              Custos
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Lucro
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last6Months}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-zinc-400 dark:text-zinc-500"
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-zinc-400 dark:text-zinc-500"
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  border: '1px solid var(--tooltip-border, #e5e7eb)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: 'var(--tooltip-text, #1f2937)'
                }}
                itemStyle={{ color: 'inherit' }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                name="Faturamento"
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#f43f5e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                name="Custos"
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorProfit)" 
                name="Lucro"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
