import React, { useState } from 'react';
import { X, User as UserIcon, Ruler, ClipboardList, Plus, Trash2, Save, ChevronRight, History } from 'lucide-react';
import { Client, ClientMember, Measurement, Order, User } from '../types';
import { OrderHistoryModal } from './OrderHistoryModal';

interface ClientDetailsModalProps {
  client: Client;
  orders: Order[];
  onClose: () => void;
  onSave: (updatedClient: Client) => void;
  initialTab?: 'measurements' | 'members' | 'orders';
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, orders, onClose, onSave, initialTab = 'measurements' }) => {
  const [activeTab, setActiveTab] = useState<'measurements' | 'members' | 'orders'>(initialTab);
  const [editedClient, setEditedClient] = useState<Client>({ ...client });
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [selectedOrderForHistory, setSelectedOrderForHistory] = useState<Order | null>(null);

  const handleMeasurementChange = (field: keyof Measurement, value: string, memberId?: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    if (memberId) {
      const updatedMembers = (editedClient.members || []).map(m => 
        m.id === memberId 
          ? { ...m, measurements: { ...m.measurements, [field]: numValue } }
          : m
      );
      setEditedClient({ ...editedClient, members: updatedMembers });
    } else {
      setEditedClient({
        ...editedClient,
        measurements: { ...editedClient.measurements, [field]: numValue }
      });
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: ClientMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName,
      measurements: {}
    };
    setEditedClient({
      ...editedClient,
      members: [...(editedClient.members || []), newMember]
    });
    setNewMemberName('');
    setShowMemberForm(false);
  };

  const handleDeleteMember = (id: string) => {
    setEditedClient({
      ...editedClient,
      members: (editedClient.members || []).filter(m => m.id !== id)
    });
  };

  const handleSave = () => {
    onSave(editedClient);
    onClose();
  };

  const clientOrders = orders.filter(o => o.clientId === client.id);

  const measurementFields: { key: keyof Measurement; label: string }[] = [
    { key: 'bust', label: 'Busto' },
    { key: 'waist', label: 'Cintura' },
    { key: 'hip', label: 'Quadril' },
    { key: 'shoulder', label: 'Ombro' },
    { key: 'armLength', label: 'Manga' },
    { key: 'totalLength', label: 'Comprimento' },
    { key: 'neck', label: 'Pescoço' },
    { key: 'backWidth', label: 'Costas' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <UserIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">{client.name}</h3>
              <p className="text-xs text-zinc-500">{client.whatsapp}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-900 px-6 bg-white dark:bg-zinc-950">
          {[
            { id: 'measurements', label: 'Medidas', icon: Ruler },
            { id: 'members', label: 'Família', icon: Plus },
            { id: 'orders', label: `Pedidos (${clientOrders.length})`, icon: ClipboardList },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-bold transition-all relative ${
                activeTab === tab.id ? 'text-brand-600 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {measurementFields.map(field => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={editedClient.measurements[field.key] || ''}
                        onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">cm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest">Membros Adicionais</h4>
                <button 
                  onClick={() => setShowMemberForm(true)}
                  className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-brand-500 transition-all"
                >
                  <Plus size={14} /> Adicionar Pessoa
                </button>
              </div>

              {showMemberForm && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-2">
                  <div className="flex gap-3">
                    <input 
                      type="text"
                      placeholder="Nome do membro (ex: Filho, Marido)"
                      className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      autoFocus
                    />
                    <button 
                      onClick={handleAddMember}
                      className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl"
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={() => setShowMemberForm(false)}
                      className="px-4 py-2 text-zinc-500 text-xs font-bold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {(editedClient.members || []).map(member => (
                  <div key={member.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                          <UserIcon size={16} />
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-white">{member.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditingMemberId(editingMemberId === member.id ? null : member.id)}
                          className="p-2 text-zinc-400 hover:text-brand-500 transition-colors"
                        >
                          <Ruler size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {editingMemberId === member.id && (
                      <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in duration-300">
                        {measurementFields.map(field => (
                          <div key={field.key} className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={member.measurements[field.key] || ''}
                                onChange={(e) => handleMeasurementChange(field.key, e.target.value, member.id)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                placeholder="0"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">cm</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {(editedClient.members || []).length === 0 && !showMemberForm && (
                  <div className="py-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl">
                    <p className="text-zinc-400 text-sm italic">Nenhum membro adicional cadastrado.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {clientOrders.length > 0 ? clientOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-zinc-900 dark:text-white">
                          {order.customPatternName || 'Peça sob medida'}
                          {order.memberId && editedClient.members && (
                            <span className="ml-2 text-brand-500 text-[10px]">
                              ({editedClient.members.find(m => m.id === order.memberId)?.name})
                            </span>
                          )}
                        </h5>
                        <span className="text-[10px] font-mono text-zinc-400">{order.orderNumber}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                        {order.status} • {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-zinc-900 dark:text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value)}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedOrderForHistory(order)}
                      className="p-2 text-zinc-400 hover:text-brand-500 transition-colors"
                      title="Ver Histórico de Produção"
                    >
                      <History size={18} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl">
                  <p className="text-zinc-400 text-sm italic">Este cliente ainda não possui pedidos.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl hover:bg-zinc-300 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </div>

      {selectedOrderForHistory && (
        <OrderHistoryModal 
          order={selectedOrderForHistory}
          client={client}
          onClose={() => setSelectedOrderForHistory(null)}
        />
      )}
    </div>
  );
};
