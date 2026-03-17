import React, { useState } from 'react';
import { Plus, UserPlus, ClipboardList, Wallet, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onNewOrder: () => void;
  onNewClient: () => void;
  onNewSale: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onNewOrder, 
  onNewClient, 
  onNewSale 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'order', label: 'Novo Pedido', icon: ClipboardList, color: 'bg-blue-500', onClick: onNewOrder },
    { id: 'client', label: 'Novo Cliente', icon: UserPlus, color: 'bg-emerald-500', onClick: onNewClient },
    { id: 'sale', label: 'Registrar Venda', icon: Wallet, color: 'bg-brand-500', onClick: onNewSale },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {/* Action Buttons */}
      <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {actions.map((action) => (
          <div key={action.id} className="flex items-center gap-3 group">
            <span className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {action.label}
            </span>
            <button
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className={`w-12 h-12 ${action.color} text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all`}
            >
              <action.icon size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 ${isOpen ? 'rotate-45 bg-zinc-800' : ''}`}
      >
        {isOpen ? <X size={24} /> : <Plus size={28} />}
      </button>
    </div>
  );
};
