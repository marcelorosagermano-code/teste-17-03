import React from 'react';
import { X, History, CheckCircle2, Clock, Scissors, Filter, Calendar } from 'lucide-react';
import { Order, OrderStatus, Client } from '../types';

interface OrderHistoryModalProps {
  order: Order;
  client?: Client;
  onClose: () => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  corte: { label: 'Corte', color: 'bg-blue-500', icon: Scissors },
  costura: { label: 'Costura', color: 'bg-amber-500', icon: Clock },
  ajuste: { label: 'Ajuste', color: 'bg-purple-500', icon: Filter },
  finalizado: { label: 'Finalizado', color: 'bg-emerald-500', icon: CheckCircle2 },
  entregue: { label: 'Entregue', color: 'bg-zinc-500', icon: Calendar },
};

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ order, client, onClose }) => {
  const history = order.history || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 text-brand-500 rounded-xl">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">Histórico do Pedido</h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{order.orderNumber}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="mb-8">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
              {client?.name || 'Cliente'}
              {order.memberId && client?.members && (
                <span className="ml-2 text-brand-500 text-xs">
                  ({client.members.find(m => m.id === order.memberId)?.name})
                </span>
              )}
            </h4>
            <p className="text-xs text-zinc-500">{order.customPatternName || 'Peça sob medida'}</p>
          </div>

          <div className="relative space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-zinc-100 dark:bg-zinc-800" />

            {history.length > 0 ? history.map((item, index) => {
              const config = STATUS_CONFIG[item.status];
              const Icon = config.icon;
              const date = new Date(item.date);

              return (
                <div key={index} className="relative flex items-start gap-6 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`relative z-10 w-8 h-8 rounded-full ${config.color} text-white flex items-center justify-center shadow-lg shadow-current/20`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{config.label}</span>
                      <span className="text-[10px] font-medium text-zinc-400">
                        {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8">
                <p className="text-sm text-zinc-500 italic">Nenhum histórico registrado.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:opacity-90 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
