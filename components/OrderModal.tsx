import React, { useState } from 'react';
import { X, ClipboardList, Calendar, DollarSign, User, Scissors, Save, Plus } from 'lucide-react';
import { Order, Client, OrderStatus } from '../types';

interface OrderModalProps {
  clients: Client[];
  onClose: () => void;
  onSave: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  onNewClient?: () => void;
  initialPattern?: { id: string, title: string };
}

export const OrderModal: React.FC<OrderModalProps> = ({ clients, onClose, onSave, onNewClient, initialPattern }) => {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [memberId, setMemberId] = useState('');
  const [patternId, setPatternId] = useState(initialPattern?.id || '');
  
  // Auto-select new client when added
  const prevClientsLength = React.useRef(clients.length);
  React.useEffect(() => {
    if (clients.length > prevClientsLength.current) {
      setClientId(clients[0].id);
    }
    prevClientsLength.current = clients.length;
  }, [clients]);

  const [customPatternName, setCustomPatternName] = useState(initialPattern?.title || '');
  const [deliveryDate, setDeliveryDate] = useState(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [value, setValue] = useState('0');
  const [status, setStatus] = useState<OrderStatus>('corte');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      clientId,
      memberId: memberId || undefined,
      patternId,
      customPatternName,
      deliveryDate: new Date(deliveryDate).toISOString(),
      value: parseFloat(value),
      status,
      notes
    });
  };

  const selectedClient = clients.find(c => c.id === clientId);
  const members = selectedClient?.members || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 rounded-xl text-brand-600 dark:text-brand-500">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">Novo Pedido</h2>
              <p className="text-xs text-zinc-500">Registre os detalhes da encomenda.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
              <User size={14} /> Cliente
            </label>
            <div className="flex gap-2">
              <select
                required
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
              >
                <option value="" disabled>Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
              {onNewClient && (
                <button
                  type="button"
                  onClick={onNewClient}
                  className="p-3 bg-zinc-100 dark:bg-zinc-800 text-brand-600 dark:text-brand-500 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Novo Cliente"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </div>

          {members.length > 0 && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2">
              <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                <User size={14} className="text-brand-500" /> Para qual membro?
              </label>
              <select
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
              >
                <option value="">Medidas Principais ({selectedClient?.name})</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
              <Scissors size={14} /> Molde / Modelo
            </label>
            <input
              required
              type="text"
              value={customPatternName}
              onChange={e => setCustomPatternName(e.target.value)}
              placeholder="Ex: Vestido Infantil Floral"
              className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Calendar size={14} /> Entrega
              </label>
              <input
                required
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                <DollarSign size={14} /> Valor (R$)
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase">Status Inicial</label>
            <div className="grid grid-cols-3 gap-2">
              {(['corte', 'costura', 'entregue'] as OrderStatus[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                    status === s 
                      ? 'bg-brand-500 border-brand-500 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase">Notas do Pedido</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Detalhes sobre tecido, ajustes, etc."
              rows={2}
              className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl hover:bg-zinc-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Criar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
