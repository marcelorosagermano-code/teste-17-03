import React, { useState } from 'react';
import { User, Client, PortfolioItem, Order } from '../types';
import { Search, Plus, User as UserIcon, Phone, Ruler, Image as ImageIcon, ChevronRight, MoreVertical, Grid, List, Share2, Trash2, ClipboardList } from 'lucide-react';
import { ClientDetailsModal } from './ClientDetailsModal';

interface AtelierTabProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onNewClient: () => void;
}

export const AtelierTab: React.FC<AtelierTabProps> = ({ user, onUpdateUser, onNewClient }) => {
  const [activeSubTab, setActiveSubTab] = useState<'clients' | 'portfolio'>('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [initialModalTab, setInitialModalTab] = useState<'measurements' | 'members' | 'orders'>('measurements');
  const stats = user.stats;
  const orders = stats?.orders || [];

  const handleOpenClientDetails = (client: Client, tab: 'measurements' | 'members' | 'orders') => {
    setInitialModalTab(tab);
    setSelectedClient(client);
  };

  const handleSaveClient = (updatedClient: Client) => {
    if (!stats) return;
    const updatedClients = stats.clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    onUpdateUser({
      ...user,
      stats: {
        ...stats,
        clients: updatedClients
      }
    });
  };

  const filteredClients = stats?.clients?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.whatsapp.includes(searchTerm)
  ) || [];

  const portfolio = stats?.portfolio || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Atelier</h1>
          <p className="text-zinc-500">Gestão de clientes e portfólio profissional.</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={() => setActiveSubTab('clients')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'clients' ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-white shadow-sm' : 'text-zinc-500'}`}
          >
            Clientes
          </button>
          <button 
            onClick={() => setActiveSubTab('portfolio')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'portfolio' ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-white shadow-sm' : 'text-zinc-500'}`}
          >
            Portfólio
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder={activeSubTab === 'clients' ? "Buscar clientes..." : "Buscar no portfólio..."}
            className="pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={onNewClient}
          className="p-3 bg-brand-600 text-white rounded-2xl hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Content */}
      {activeSubTab === 'clients' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.length > 0 ? filteredClients.map(client => (
            <div key={client.id} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-brand-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">{client.name}</h4>
                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                      <Phone size={10} />
                      {client.whatsapp}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Busto</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white">{client.measurements.bust || '-'} cm</span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Cintura</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white">{client.measurements.waist || '-'} cm</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenClientDetails(client, 'measurements')}
                  className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <Ruler size={14} />
                  Medidas
                </button>
                <button 
                  onClick={() => handleOpenClientDetails(client, 'orders')}
                  className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <ClipboardList size={14} />
                  Pedidos
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <UserIcon size={48} className="mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Nenhum cliente encontrado</h3>
              <p className="text-zinc-500 text-sm">Comece cadastrando seu primeiro cliente.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {portfolio.length > 0 ? portfolio.map(item => (
            <div key={item.id} className="aspect-square rounded-3xl overflow-hidden relative group">
              <img src={item.photoUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Portfolio" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white text-xs font-bold truncate">{item.description || 'Sem descrição'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-all">
                    <Share2 size={14} />
                  </button>
                  <button className="p-2 bg-red-500/20 backdrop-blur-md rounded-lg text-red-400 hover:bg-red-500/40 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <ImageIcon size={48} className="mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Seu portfólio está vazio</h3>
              <p className="text-zinc-500 text-sm">Adicione fotos das suas peças finalizadas.</p>
            </div>
          )}
        </div>
      )}

      {selectedClient && (
        <ClientDetailsModal 
          client={selectedClient}
          orders={orders}
          initialTab={initialModalTab}
          onClose={() => setSelectedClient(null)}
          onSave={handleSaveClient}
        />
      )}
    </div>
  );
};
