import React from 'react';
import { User, Order, Lesson } from '../types';
import { ArrowRight, Calendar, TrendingUp, Target, PlayCircle, Clock, AlertCircle, Plus, ClipboardList, Sparkles } from 'lucide-react';

interface HomeTabProps {
  user: User;
  onNewOrder: () => void;
  onContinueLesson: (lesson: Lesson) => void;
  lastLesson?: Lesson;
}

export const HomeTab: React.FC<HomeTabProps> = ({ user, onNewOrder, onContinueLesson, lastLesson }) => {
  const stats = user.stats;
  const upcomingOrders = stats?.orders?.filter(o => o.status !== 'entregue').slice(0, 3) || [];
  const overdueOrders = upcomingOrders.filter(o => new Date(o.deliveryDate) < new Date());

  const progress = stats?.goals ? (stats.goals.current / stats.goals.monthly) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Olá, {user.name.split(' ')[0]}!</h1>
          <p className="text-zinc-500 dark:text-zinc-500">Seu atelier está a todo vapor hoje.</p>
        </div>
        <button 
          onClick={onNewOrder}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Novo Pedido
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lucro do Mês</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.goals?.current || 0)}
            </h3>
            <p className="text-xs text-zinc-500">Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.goals?.monthly || 0)}</p>
          </div>
          <div className="mt-4 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
              <ClipboardList size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pedidos Ativos</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
              {upcomingOrders.length}
            </h3>
            <p className="text-xs text-zinc-500">
              {overdueOrders.length > 0 ? `${overdueOrders.length} atrasados` : 'Tudo em dia'}
            </p>
          </div>
          <div className="mt-4 flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                {i}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
              +
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
              <Target size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Progresso de Metas</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
              {Math.round(progress)}%
            </h3>
            <p className="text-xs text-zinc-500">Faltam {Math.round(100 - progress)}% para a meta</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 transition-all duration-1000" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Deliveries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-brand-500" />
              Próximas Entregas
            </h2>
            <button className="text-xs font-bold text-brand-500 hover:underline">Ver todos</button>
          </div>
          
          <div className="space-y-3">
            {upcomingOrders.length > 0 ? upcomingOrders.map(order => {
              const client = stats?.clients?.find(c => c.id === order.clientId);
              const isOverdue = new Date(order.deliveryDate) < new Date();
              
              return (
                <div key={order.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group hover:border-brand-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isOverdue ? 'bg-red-500/10 text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      {isOverdue ? <AlertCircle size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{client?.name || 'Cliente'}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-zinc-400 font-mono">{order.orderNumber}</p>
                        <span className="text-zinc-300">•</span>
                        <p className="text-xs text-zinc-500">
                          Entrega: {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                      order.status === 'corte' ? 'bg-blue-500/10 text-blue-500' :
                      order.status === 'costura' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value)}
                    </p>
                  </div>
                </div>
              );
            }) : (
              <div className="py-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500 text-sm">Nenhum pedido pendente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Continue Learning */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <PlayCircle size={20} className="text-brand-500" />
              Continuar Aprendendo
            </h2>
          </div>

          {lastLesson ? (
            <div className="bg-zinc-900 rounded-3xl overflow-hidden relative group aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                alt="Aula"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Módulo em andamento</span>
                <h3 className="text-xl font-black text-white mb-4">{lastLesson.title}</h3>
                <button 
                  onClick={() => onContinueLesson(lastLesson)}
                  className="w-fit px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-brand-50 transition-colors"
                >
                  Continuar Aula
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-brand-600 to-rose-700 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-black mb-2">Explore novos moldes!</h3>
              <p className="text-brand-100 text-sm mb-6">Aprenda técnicas profissionais e aumente seu faturamento.</p>
              <button className="px-6 py-3 bg-white text-brand-600 font-bold rounded-xl flex items-center gap-2">
                Ver Biblioteca
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Smart Insight */}
      <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6 flex items-start gap-4 mb-8">
        <div className="p-3 bg-blue-500 text-white rounded-2xl">
          <Sparkles size={24} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-100">Insight do Atelier</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            "Vestidos geraram 40% do seu lucro este mês. Que tal criar uma nova coleção de vestidos de festa?"
          </p>
        </div>
      </div>
    </div>
  );
};
