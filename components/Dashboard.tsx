import React, { useState, useEffect } from 'react';
import { User, Module, Lesson, Product, Order } from '../types';
import { Sidebar } from './Sidebar';
import { VideoPlayer } from './VideoPlayer';
import { InstallButton } from './InstallButton';
import { Checkout } from './Checkout';
import { HomeTab } from './HomeTab';
import { OrdersTab } from './OrdersTab';
import { PatternsTab } from './PatternsTab';
import { AtelierTab } from './AtelierTab';
import { FinancialControl } from './FinancialControl';
import { BottomNav, TabType } from './BottomNav';
import { FloatingActionButton } from './FloatingActionButton';
import { ClientModal } from './ClientModal';
import { OrderModal } from './OrderModal';
import { Menu, LogOut, FileText, ChevronRight, Scissors, User as UserIcon, Sparkles, Crown, CheckCircle, Sun, Moon, Download } from 'lucide-react';

interface DashboardProps {
  user: User;
  modules: Module[];
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, modules, onLogout, onUpdateUser, theme, onToggleTheme }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<{ id: string, title: string } | undefined>(undefined);

  const currentModule = currentLesson ? modules.find(m => m.lessons.some(l => l.id === currentLesson.id)) : null;

  const handleNewOrder = () => {
    if (!user.stats?.clients || user.stats.clients.length === 0) {
      alert('Você precisa cadastrar pelo menos um cliente antes de criar um pedido.');
      setActiveTab('atelier');
      return;
    }
    setSelectedPattern(undefined);
    setShowOrderModal(true);
  };

  const handleNewClient = () => {
    setShowClientModal(true);
  };

  const handleNewSale = () => {
    setActiveTab('financial');
    // For now, just redirect to financial. In the future, open a specific sale modal.
  };

  const handleOrderFromPattern = (pattern: any) => {
    if (!user.stats?.clients || user.stats.clients.length === 0) {
      alert('Você precisa cadastrar pelo menos um cliente antes de criar um pedido.');
      setActiveTab('atelier');
      return;
    }
    setSelectedPattern({ id: pattern.id, title: pattern.title });
    setShowOrderModal(true);
  };

  const saveClient = (clientData: any) => {
    const newClient = {
      ...clientData,
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      photos: []
    };

    const currentStats = user.stats || {
      clients: [],
      orders: [],
      portfolio: [],
      goals: { monthly: 5000, current: 0 }
    };

    const updatedUser = {
      ...user,
      stats: {
        ...currentStats,
        clients: [newClient, ...(currentStats.clients || [])]
      }
    };

    onUpdateUser(updatedUser);
    setShowClientModal(false);
    alert('Cliente cadastrado com sucesso!');
  };

  const saveOrder = (orderData: any) => {
    const currentStats = user.stats || {
      clients: [],
      orders: [],
      portfolio: [],
      goals: { monthly: 5000, current: 0 }
    };

    const nextNumber = (currentStats.orders?.length || 0) + 1;
    const orderNumber = `PED-${nextNumber.toString().padStart(4, '0')}`;

    const newOrder = {
      ...orderData,
      id: `o-${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      history: [{ status: orderData.status, date: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };

    const updatedUser = {
      ...user,
      stats: {
        ...currentStats,
        orders: [newOrder, ...(currentStats.orders || [])]
      }
    };

    onUpdateUser(updatedUser);
    setShowOrderModal(false);
    setActiveTab('orders');
    alert('Pedido criado com sucesso!');
  };

  const upgradeProduct: Product = {
    id: 'upgrade-diamond',
    title: 'Upgrade para Plano Diamante',
    description: 'Tenha acesso a todos os moldes exclusivos e aulas avançadas.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=800',
    category: 'Upgrade',
    features: ['Acesso Ilimitado', 'Suporte Prioritário', 'Novos Moldes Mensais']
  };

  const handleUpgradeSuccess = () => {
    const updatedUser = { ...user, plan: 'diamond' as const };
    onUpdateUser(updatedUser);
    setShowUpgradeModal(false);
  };

  const renderTabContent = () => {
    if (currentLesson) {
      if (currentLesson.id === 'aula-03-01') {
        return <PatternsTab onOrderFromPattern={handleOrderFromPattern} />;
      }
      
      if (currentLesson.id === 'aula-03-diamond' && user.plan === 'basic') {
        return (
          <section className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-zinc-900 rounded-2xl p-10 max-w-xl mx-auto flex flex-col items-center animate-border-glow">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-amber-500/50">
                  <Crown size={32} className="text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Desbloqueie o Plano <span className="text-amber-500">Diamante</span></h2>
                <p className="text-zinc-400 mb-6 leading-relaxed">Tenha acesso a todos os moldes exclusivos, suporte prioritário e novos lançamentos mensais.</p>
                <a href="https://pay.cakto.com.br/r5d8yjt" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                  Desbloquear por R$ 8,00
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>
          </section>
        );
      }

      return (
        <div className="space-y-8">
          <VideoPlayer 
            videoId={currentLesson.videoEmbedId} 
            videoUrl={currentLesson.videoUrl}
            youtubeId={currentLesson.youtubeId}
            title={currentLesson.title} 
          />
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex-1 space-y-4">
              <span className="text-brand-500 font-bold text-xs uppercase tracking-wider">{currentModule?.title}</span>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{currentLesson.title}</h1>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">{currentLesson.description}</p>
            </div>
            <div className="w-full md:w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><FileText size={16} className="text-brand-500"/>Arquivos</h3>
              {currentLesson.materialLink ? (
                <a href={currentLesson.materialLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-brand-600 text-white rounded-xl text-sm font-medium shadow-lg hover:bg-brand-500 transition-all">
                  <Download size={16} /> Baixar Molde PDF
                </a>
              ) : (
                <div className="py-6 text-center text-zinc-400 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">Sem moldes</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
            <HomeTab 
              user={user} 
              onNewOrder={handleNewOrder} 
              onContinueLesson={(lesson) => setCurrentLesson(lesson)}
              lastLesson={modules[0]?.lessons[0]}
            />
        );
      case 'orders':
        return <OrdersTab user={user} onUpdateUser={onUpdateUser} onNewOrder={handleNewOrder} />;
      case 'patterns':
        return <PatternsTab onOrderFromPattern={handleOrderFromPattern} />;
      case 'financial':
        return <FinancialControl user={user} onUpdateUser={onUpdateUser} />;
      case 'atelier':
        return <AtelierTab user={user} onUpdateUser={onUpdateUser} onNewClient={handleNewClient} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[100dvh] bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors duration-500 overscroll-none touch-pan-y">
      <Sidebar 
        modules={modules}
        currentLessonId={currentLesson?.id || null}
        onSelectLesson={(lesson) => {
          setCurrentLesson(lesson);
          if (lesson) setActiveTab('patterns');
        }}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full min-w-0 bg-zinc-50 dark:bg-zinc-950 relative transition-colors duration-500">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-30 transition-colors duration-500">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
              <Scissors size={14} />
              <span>Atelier Kids</span>
              <ChevronRight size={14} />
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                {currentLesson ? 'AULA' : activeTab.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <InstallButton />
            <button onClick={onToggleTheme} className="p-2 text-zinc-500 hover:text-brand-500 rounded-full transition-all">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{user.plan} Member</span>
            </div>
            <button onClick={onLogout} className="p-2 text-zinc-400 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-48 custom-scrollbar overscroll-contain">
          <div className="max-w-6xl mx-auto">
            {renderTabContent()}
          </div>
        </div>

        <FloatingActionButton 
          onNewOrder={handleNewOrder} 
          onNewClient={handleNewClient} 
          onNewSale={handleNewSale} 
        />
        
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentLesson(null);
          }} 
        />
      </main>

      {showUpgradeModal && (
        <Checkout product={upgradeProduct} onClose={() => setShowUpgradeModal(false)} onSuccess={handleUpgradeSuccess} />
      )}

      {showClientModal && (
        <ClientModal onClose={() => setShowClientModal(false)} onSave={saveClient} />
      )}

      {showOrderModal && (
        <OrderModal 
          clients={user.stats?.clients || []} 
          onClose={() => setShowOrderModal(false)} 
          onSave={saveOrder} 
          onNewClient={handleNewClient}
          initialPattern={selectedPattern}
        />
      )}
    </div>
  );
};
