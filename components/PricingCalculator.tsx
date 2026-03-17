import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Clock, Percent, Plus, Trash2 } from 'lucide-react';

export const PricingCalculator: React.FC = () => {
  const [fabricCost, setFabricCost] = useState<string>('');
  const [accessoriesCost, setAccessoriesCost] = useState<string>('');
  const [laborHours, setLaborHours] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [indirectCosts, setIndirectCosts] = useState<string>('');
  const [profitMargin, setProfitMargin] = useState<string>('');

  const [totalCost, setTotalCost] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [profitAmount, setProfitAmount] = useState<number>(0);

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const amount = (parseInt(digits) / 100).toFixed(2);
    return amount.replace('.', ',');
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(',', '.')) || 0;
  };

  useEffect(() => {
    const fabric = parseCurrency(fabricCost);
    const accessories = parseCurrency(accessoriesCost);
    const hours = parseFloat(laborHours) || 0;
    const rate = parseCurrency(hourlyRate);
    const indirect = parseCurrency(indirectCosts);
    const margin = parseFloat(profitMargin) || 0;

    const laborCost = hours * rate;
    const cost = fabric + accessories + laborCost + indirect;
    const marginMultiplier = 1 + (margin / 100);
    const price = cost * marginMultiplier;
    
    setTotalCost(cost);
    setFinalPrice(price);
    setProfitAmount(price - cost);
  }, [fabricCost, accessoriesCost, laborHours, hourlyRate, indirectCosts, profitMargin]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-colors duration-500">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 rounded-lg text-brand-600 dark:text-brand-500">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Calculadora de Precificação</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">Defina seus custos e margem de lucro</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <DollarSign size={12} /> Tecido (R$)
              </label>
              <input 
                type="text" 
                inputMode="numeric"
                value={fabricCost}
                onChange={(e) => setFabricCost(formatCurrency(e.target.value))}
                placeholder="0,00"
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Plus size={12} /> Acessórios (R$)
              </label>
              <input 
                type="text" 
                inputMode="numeric"
                value={accessoriesCost}
                onChange={(e) => setAccessoriesCost(formatCurrency(e.target.value))}
                placeholder="0,00"
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Clock size={12} /> Horas de Trabalho
              </label>
              <input 
                type="number" 
                step="0.1"
                value={laborHours}
                onChange={(e) => setLaborHours(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <DollarSign size={12} /> Valor da Hora (R$)
              </label>
              <input 
                type="text" 
                inputMode="numeric"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(formatCurrency(e.target.value))}
                placeholder="0,00"
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Trash2 size={12} /> Custos Indiretos (R$)
              </label>
              <input 
                type="text" 
                inputMode="numeric"
                value={indirectCosts}
                onChange={(e) => setIndirectCosts(formatCurrency(e.target.value))}
                placeholder="0,00"
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Percent size={12} /> Margem de Lucro (%)
              </label>
              <input 
                type="number" 
                step="1"
                value={profitMargin}
                onChange={(e) => setProfitMargin(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-zinc-100 dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-inner">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-500">Custo de Produção:</span>
              <span className="text-zinc-900 dark:text-white font-medium">R$ {totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-500">Lucro Desejado ({profitMargin}%):</span>
              <span className="text-emerald-600 dark:text-emerald-500 font-medium">+ R$ {profitAmount.toFixed(2)}</span>
            </div>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2"></div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-bold">Preço de Venda Sugerido</span>
              <span className="text-4xl font-black text-zinc-900 dark:text-white">R$ {finalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-brand-500/5 border border-brand-500/20 rounded-xl">
            <p className="text-[10px] text-brand-600 dark:text-brand-400 leading-relaxed">
              * Este cálculo considera custos fixos e variáveis. Lembre-se de sempre reavaliar seus custos de mercado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
