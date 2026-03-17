import React from 'react';
import { Home, Scissors, ClipboardList, Wallet, Store } from 'lucide-react';

export type TabType = 'home' | 'orders' | 'patterns' | 'financial' | 'atelier';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'orders', label: 'Pedidos', icon: ClipboardList },
    { id: 'patterns', label: 'Moldes', icon: Scissors },
    { id: 'financial', label: 'Financeiro', icon: Wallet },
    { id: 'atelier', label: 'Atelier', icon: Store },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full p-2 shadow-2xl flex items-center justify-around pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`
                flex flex-col items-center justify-center gap-1 p-2 rounded-full transition-all duration-300 min-w-[64px]
                ${isActive 
                  ? 'text-brand-600 dark:text-brand-500 scale-110' 
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'}
              `}
            >
              <div className={`
                p-2 rounded-full transition-all duration-300
                ${isActive ? 'bg-brand-500/10' : 'bg-transparent'}
              `}>
                <Icon size={20} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
