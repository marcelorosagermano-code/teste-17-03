import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Order, OrderStatus, Client, User } from '../types';
import { Search, Filter, Plus, MoreVertical, Calendar, User as UserIcon, Scissors, ChevronRight, CheckCircle2, Clock, AlertCircle, Grid, List, History, MessageCircle } from 'lucide-react';
import { OrderHistoryModal } from './OrderHistoryModal';

interface OrdersTabProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onNewOrder: () => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any; message: string }> = {
  corte: { label: 'Corte', color: 'bg-blue-500', icon: Scissors, message: 'Olá! Seu pedido entrou na etapa de Corte ✂️' },
  costura: { label: 'Costura', color: 'bg-amber-500', icon: Clock, message: 'Olá! Seu pedido já está na Costura 🧵' },
  ajuste: { label: 'Ajuste', color: 'bg-purple-500', icon: Filter, message: 'Olá! Estamos fazendo os últimos ajustes no seu pedido 🪡' },
  finalizado: { label: 'Finalizado', color: 'bg-emerald-500', icon: CheckCircle2, message: 'Olá! Seu pedido está pronto! Pode vir buscar ✨' },
  entregue: { label: 'Entregue', color: 'bg-zinc-500', icon: Calendar, message: 'Olá! Obrigado pela preferência! Seu pedido foi entregue 🛍️' },
};

export const OrdersTab: React.FC<OrdersTabProps> = ({ user, onUpdateUser, onNewOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedOrderForHistory, setSelectedOrderForHistory] = useState<Order | null>(null);
  const stats = user.stats;
  const orders = stats?.orders || [];
  const clients = stats?.clients || [];

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    orderId: string | null;
    currentStatus: OrderStatus | null;
    newStatus: OrderStatus | null;
    orderNumber?: string;
    addToFinance?: boolean;
    orderValue?: number;
  }>({ isOpen: false, orderId: null, currentStatus: null, newStatus: null, addToFinance: false });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('list');
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const requestStatusUpdate = (orderId: string, currentStatus: OrderStatus, newStatus: OrderStatus, orderNumber: string, orderValue: number) => {
    setConfirmationModal({ 
      isOpen: true, 
      orderId, 
      currentStatus, 
      newStatus, 
      orderNumber, 
      orderValue,
      addToFinance: newStatus === 'entregue' // Default to true if status is 'entregue', or let user decide. Let's default to false and let user check.
    });
  };

  const confirmStatusUpdate = () => {
    if (confirmationModal.orderId && confirmationModal.newStatus) {
      updateOrderStatus(
        confirmationModal.orderId, 
        confirmationModal.newStatus, 
        confirmationModal.addToFinance,
        confirmationModal.orderValue
      );
    }
    setConfirmationModal({ isOpen: false, orderId: null, currentStatus: null, newStatus: null, addToFinance: false });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, addToFinance: boolean = false, finalValue?: number) => {
    if (!stats) return;
    
    let updatedStats = { ...stats };
    
    // Update Order Status and Value
    const newOrders = (stats.orders || []).map(o => {
      if (o.id === orderId) {
        const newHistory = [...(o.history || []), { status: newStatus, date: new Date().toISOString() }];
        return { 
          ...o, 
          status: newStatus, 
          history: newHistory,
          value: finalValue !== undefined ? finalValue : o.value
        };
      }
      return o;
    });
    updatedStats.orders = newOrders;

    // Add to Financial Records if requested
    if (addToFinance && newStatus === 'entregue') {
      const order = newOrders.find(o => o.id === orderId);
      if (order) {
        const newRecord = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'income' as const,
          category: 'Venda de Peça',
          description: `Pedido ${order.orderNumber} - ${order.customPatternName || 'Sob Medida'}`,
          amount: order.value,
          date: new Date().toISOString().split('T')[0],
        };
        
        updatedStats.financialRecords = [newRecord, ...(updatedStats.financialRecords || [])];
        
        // Update totals
        const totalIncome = updatedStats.financialRecords.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
        updatedStats.totalSales = totalIncome;
        
        const totalExpense = updatedStats.financialRecords.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
        updatedStats.goals = {
            ...updatedStats.goals,
            current: totalIncome - totalExpense
        };
      }
    }

    onUpdateUser({
      ...user,
      stats: updatedStats
    });
  };

  const sendWhatsAppNotification = (order: Order, client?: Client) => {
    if (!client?.whatsapp) {
      alert('Cliente sem número de WhatsApp cadastrado.');
      return;
    }
    
    const message = STATUS_CONFIG[order.status].message;
    const fullMessage = `${message} (Pedido: ${order.orderNumber})`;
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${client.whatsapp.replace(/\D/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const filteredOrders = orders.filter(order => {
    const client = clients.find(c => c.id === order.clientId);
    const searchLower = searchTerm.toLowerCase();
    return (
      client?.name.toLowerCase().includes(searchLower) || 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
      (order.customPatternName && order.customPatternName.toLowerCase().includes(searchLower)) ||
      (order.notes && order.notes.toLowerCase().includes(searchLower))
    );
  });

  const columns: OrderStatus[] = ['corte', 'costura', 'ajuste', 'finalizado', 'entregue'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Pedidos</h1>
          <p className="text-zinc-500">Gerencie seu fluxo de produção.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 mr-2">
            <button 
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'board' ? 'bg-white dark:bg-zinc-800 text-brand-600 shadow-sm' : 'text-zinc-500'}`}
              title="Visualização em Quadro"
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-brand-600 shadow-sm' : 'text-zinc-500'}`}
              title="Visualização em Lista"
            >
              <List size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar pedidos..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={onNewOrder}
            className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-500 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'board' ? (
        <div className="flex-1 overflow-x-auto pb-12 -mx-4 px-4 custom-scrollbar">
          <div className="flex gap-4 md:gap-6 min-w-max h-full pr-12">
            {columns.map(status => (
              <div key={status} className="w-72 md:w-80 flex flex-col gap-4">
                {/* Column Header */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status].color}`} />
                    <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-xs">
                      {STATUS_CONFIG[status].label}
                    </h3>
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {filteredOrders.filter(o => o.status === status).length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="flex-1 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-3xl p-3 space-y-3 min-h-[500px] border border-zinc-200 dark:border-zinc-800/50">
                  {filteredOrders.filter(o => o.status === status).map(order => {
                    const client = clients.find(c => c.id === order.clientId);
                    const isOverdue = new Date(order.deliveryDate) < new Date() && order.status !== 'entregue';

                    return (
                      <div 
                        key={order.id} 
                        className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-brand-500/30 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                              <UserIcon size={14} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[140px]">
                                {client?.name || 'Cliente'}
                              </h4>
                              <p className="text-[10px] text-zinc-400 font-mono">{order.orderNumber}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => sendWhatsAppNotification(order, client)}
                            className="p-1 text-zinc-400 hover:text-green-500 transition-colors"
                            title="Enviar Notificação WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button 
                            onClick={() => setSelectedOrderForHistory(order)}
                            className="p-1 text-zinc-400 hover:text-brand-500 transition-colors"
                            title="Ver Histórico"
                          >
                            <History size={16} />
                          </button>
                          <button className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 line-clamp-1">
                            {order.customPatternName || 'Peça sob medida'}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-zinc-500">
                              <Calendar size={12} className={isOverdue ? 'text-red-500' : ''} />
                              <span className={isOverdue ? 'text-red-500 font-bold' : ''}>
                                {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <span className="font-black text-zinc-900 dark:text-white">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            {status !== 'corte' && (
                              <button 
                                onClick={() => requestStatusUpdate(order.id, status, columns[columns.indexOf(status) - 1], order.orderNumber, order.value)}
                                className="flex-1 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center"
                              >
                                <ChevronRight size={14} className="rotate-180" />
                              </button>
                            )}
                            {status !== 'entregue' && (
                              <button 
                                onClick={() => requestStatusUpdate(order.id, status, columns[columns.indexOf(status) + 1], order.orderNumber, order.value)}
                                className="flex-[2] py-1.5 bg-brand-500/10 text-brand-500 rounded-lg hover:bg-brand-500/20 transition-colors flex items-center justify-center gap-1 text-[10px] font-bold"
                              >
                                Próxima Etapa
                                <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredOrders.filter(o => o.status === status).length === 0 && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vazio</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {filteredOrders.length > 0 ? filteredOrders.map(order => {
            const client = clients.find(c => c.id === order.clientId);
            const isOverdue = new Date(order.deliveryDate) < new Date() && order.status !== 'entregue';
            const StatusIcon = STATUS_CONFIG[order.status].icon;

            return (
              <div 
                key={order.id}
                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/30 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${STATUS_CONFIG[order.status].color} text-white shadow-lg shadow-current/20`}>
                    <StatusIcon size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-0.5">
                      <h4 className="font-bold text-zinc-900 dark:text-white truncate">
                        {client?.name || 'Cliente'}
                        {order.memberId && client?.members && (
                          <span className="ml-1 text-brand-500 text-[10px]">
                            ({client.members.find(m => m.id === order.memberId)?.name})
                          </span>
                        )}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[order.status].color} bg-opacity-10 ${STATUS_CONFIG[order.status].color.replace('bg-', 'text-')}`}>
                        {STATUS_CONFIG[order.status].label}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{order.orderNumber}</span>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium line-clamp-1">
                      {order.customPatternName || 'Peça sob medida'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-8 flex-wrap">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Status</p>
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{STATUS_CONFIG[order.status].label}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Entrega</p>
                    <p className={`text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Valor</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value)}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => sendWhatsAppNotification(order, client)}
                      className="p-2 text-zinc-400 hover:text-green-500 transition-colors"
                      title="Enviar Notificação WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button 
                      onClick={() => setSelectedOrderForHistory(order)}
                      className="p-2 text-zinc-400 hover:text-brand-500 transition-colors"
                      title="Ver Histórico"
                    >
                      <History size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        const idx = columns.indexOf(order.status);
                        if (idx > 0) requestStatusUpdate(order.id, order.status, columns[idx - 1], order.orderNumber, order.value);
                      }}
                      disabled={order.status === 'corte'}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-xl hover:bg-zinc-200 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <button 
                      onClick={() => {
                        const idx = columns.indexOf(order.status);
                        if (idx < columns.length - 1) requestStatusUpdate(order.id, order.status, columns[idx + 1], order.orderNumber, order.value);
                      }}
                      disabled={order.status === 'entregue'}
                      className="p-2 bg-brand-500/10 text-brand-500 rounded-xl hover:bg-brand-500/20 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <AlertCircle size={48} className="mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Nenhum pedido encontrado</h3>
              <p className="text-zinc-500 text-sm">Tente ajustar sua busca ou crie um novo pedido.</p>
            </div>
          )}
        </div>
      )}

      {selectedOrderForHistory && (
        <OrderHistoryModal 
          order={selectedOrderForHistory}
          client={clients.find(c => c.id === selectedOrderForHistory.clientId)}
          onClose={() => setSelectedOrderForHistory(null)}
        />
      )}

      {confirmationModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Confirmar Alteração</h3>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                <p className="mb-4">
                  Deseja alterar o status do pedido <strong>{confirmationModal.orderNumber}</strong>?
                </p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${confirmationModal.currentStatus ? STATUS_CONFIG[confirmationModal.currentStatus].color.replace('bg-', 'text-') + ' bg-opacity-10 ' + STATUS_CONFIG[confirmationModal.currentStatus].color : ''}`}>
                    {confirmationModal.currentStatus && STATUS_CONFIG[confirmationModal.currentStatus].label}
                  </div>
                  <ChevronRight size={16} className="text-zinc-400" />
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${confirmationModal.newStatus ? STATUS_CONFIG[confirmationModal.newStatus].color.replace('bg-', 'text-') + ' bg-opacity-10 ' + STATUS_CONFIG[confirmationModal.newStatus].color : ''}`}>
                    {confirmationModal.newStatus && STATUS_CONFIG[confirmationModal.newStatus].label}
                  </div>
                </div>
                <span className="text-xs opacity-75">Isso criará um registro no histórico do pedido.</span>
                
                {confirmationModal.newStatus === 'entregue' && (
                  <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl flex flex-col gap-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center h-5">
                        <input
                          id="addToFinance"
                          type="checkbox"
                          checked={confirmationModal.addToFinance}
                          onChange={(e) => setConfirmationModal(prev => ({ ...prev, addToFinance: e.target.checked }))}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                      </div>
                      <label htmlFor="addToFinance" className="text-xs text-emerald-800 dark:text-emerald-300 cursor-pointer select-none">
                        <span className="font-bold block mb-0.5">Lançar valor em financeiro?</span>
                        Adicionar receita ao caixa.
                      </label>
                    </div>

                    {confirmationModal.addToFinance && (
                      <div className="pl-7">
                        <label className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1 block">Valor Final (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={confirmationModal.orderValue}
                          onChange={(e) => setConfirmationModal(prev => ({ ...prev, orderValue: parseFloat(e.target.value) }))}
                          className="w-full bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3 w-full">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmationModal({ isOpen: false, orderId: null, currentStatus: null, newStatus: null });
                  }}
                  className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmStatusUpdate();
                  }}
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-500 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
