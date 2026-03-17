import React, { useState, useEffect } from 'react';
import { User, Module, Lesson, Product } from '../types';
import { Sidebar } from './Sidebar';
import { VideoPlayer } from './VideoPlayer';
import { InstallButton } from './InstallButton'; // Novo componente
import { Checkout } from './Checkout';
import { BasicPackageViewNew as BasicPackageView } from './BasicPackageViewNew';
import { Menu, LogOut, Download, FileText, ChevronRight, Scissors, User as UserIcon, Sparkles, Crown, CheckCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
  modules: Module[];
  onLogout: () => void;
}

export const DashboardNew: React.FC<DashboardProps> = ({ user: initialUser, modules, onLogout }) => {
  // State initialization
  const [user, setUser] = useState(initialUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasClickedMenu, setHasClickedMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Default to first lesson of first module
  const [currentLesson, setCurrentLesson] = useState<Lesson>(() => {
     if (modules.length > 0 && modules[0].lessons.length > 0) {
       return modules[0].lessons[0];
     }
     return {} as Lesson; // Should ideally handle empty state
  });

  const currentModule = modules.find(m => m.lessons.some(l => l.id === currentLesson.id));

  const upgradeProduct: Product = {
    id: 'upgrade-diamond',
    title: 'Upgrade para Plano Diamante',
    description: 'Tenha acesso a todos os moldes exclusivos e aulas avançadas.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=800', // Luxury/Fashion image
    category: 'Upgrade',
    features: ['Acesso Ilimitado', 'Suporte Prioritário', 'Novos Moldes Mensais']
  };

  const handleUpgradeSuccess = () => {
    const updatedUser = { ...user, plan: 'diamond' as const };
    setUser(updatedUser);
    // Update local storage to persist the change
    localStorage.setItem('lumina_session_user', JSON.stringify(updatedUser));
    
    // Update persistent DB
    const dbStr = localStorage.getItem('atelier_kids_db');
    const db = dbStr ? JSON.parse(dbStr) : {};
    db[updatedUser.cpf] = updatedUser;
    localStorage.setItem('atelier_kids_db', JSON.stringify(db));

    setShowUpgradeModal(false);
  };

  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        modules={modules}
        currentLessonId={currentLesson.id}
        onSelectLesson={setCurrentLesson}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-zinc-950 relative">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-black/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSidebarOpen(true);
                setHasClickedMenu(true);
              }}
              className={`lg:hidden flex items-center gap-2 p-2 rounded-md transition-all relative ${
                !hasClickedMenu 
                  ? 'text-brand-500 bg-brand-500/10 ring-1 ring-brand-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Menu size={20} className={!hasClickedMenu ? 'animate-pulse' : ''} />
              <span className="font-medium text-sm">Menu</span>
              {!hasClickedMenu && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full animate-ping" />
              )}
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
              <Scissors size={14} />
              <span>Meus Moldes</span>
              <ChevronRight size={14} />
              <span className="text-zinc-300 font-medium truncate max-w-[200px]">{currentModule?.title || 'Geral'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Upgrade Button */}
            {user.plan === 'basic' && (
              <button
                onClick={() => {
                  const diamondLesson = modules.flatMap(m => m.lessons).find(l => l.id === 'aula-03-diamond');
                  if (diamondLesson) setCurrentLesson(diamondLesson);
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Crown size={14} />
                Upgrade Diamante
              </button>
            )}

            {/* Install App Button */}
            <InstallButton />

            <div className="h-6 w-px bg-zinc-800 mx-1 hidden md:block"></div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  {user.plan === 'diamond' ? 'Membro Diamante' : 'Membro Básico'}
                </span>
                {user.plan === 'diamond' && <Sparkles size={10} className="text-amber-400" />}
              </div>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white shadow-lg ${
              user.plan === 'diamond' 
                ? 'bg-gradient-to-br from-amber-400 to-yellow-600 shadow-amber-500/20' 
                : 'bg-gradient-to-br from-brand-500 to-rose-600 shadow-brand-500/20'
            }`}>
              <UserIcon size={16} />
            </div>
            
            <button 
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Content Section: Video or Upgrade Locked Screen */}
            {currentLesson.id === 'aula-03-01' ? (
              <BasicPackageView />
            ) : currentLesson.id === 'aula-03-diamond' && user.plan === 'basic' ? (
              <section className="flex flex-col items-center justify-center py-8 md:py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  
                  {/* Card Content */}
                  <div className="relative bg-zinc-900 rounded-2xl p-6 md:p-10 max-w-xl mx-auto flex flex-col items-center animate-border-glow">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform duration-300">
                      <Crown size={32} className="text-amber-500" />
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      Desbloqueie o Plano <span className="text-amber-500">Diamante</span>
                    </h2>
                    
                    <p className="text-zinc-400 text-sm md:text-base mb-6 max-w-sm mx-auto leading-relaxed">
                      Tenha acesso a <strong>todos os moldes exclusivos</strong>, suporte prioritário e novos lançamentos mensais. 
                      Pague apenas a diferença do seu plano atual.
                    </p>

                    <a 
                      href="https://pay.cakto.com.br/r5d8yjt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative overflow-hidden px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-base rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group/btn"
                    >
                      <div className="shine-effect"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        <span>Fazer Upgrade por R$ 8,00</span>
                        <ChevronRight size={18} />
                      </span>
                    </a>
                    
                    <p className="mt-4 text-[10px] text-zinc-500 uppercase tracking-widest">
                      Acesso Imediato • Pagamento Seguro
                    </p>
                  </div>
                </div>
              </section>
            ) : currentLesson.id === 'aula-03-diamond' && user.plan === 'diamond' ? (
               <section className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                 <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2 ring-1 ring-green-500/50">
                    <CheckCircle size={40} className="text-green-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white">Você é Membro Diamante!</h2>
                 <p className="text-zinc-400 max-w-md">
                   Obrigado por ser um membro VIP. Você tem acesso a todo o conteúdo exclusivo.
                   Novos moldes são adicionados mensalmente nesta pasta.
                 </p>
                 <a 
                    href="https://drive.google.com/drive/folders/YOUR_DIAMOND_FOLDER_LINK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
                  >
                    <Download size={20} />
                    Acessar Pasta Diamante
                  </a>
               </section>
            ) : (
              <>
                {/* Video Section */}
                <section>
                  <VideoPlayer 
                    videoId={currentLesson.videoEmbedId} 
                    videoUrl={currentLesson.videoUrl}
                    youtubeId={currentLesson.youtubeId}
                    title={currentLesson.title} 
                  />
                </section>

                {/* Lesson Info Section */}
                <section className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-zinc-800 pb-8">
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="text-brand-500 font-bold text-xs uppercase tracking-wider mb-12 block">
                        {currentModule?.title}
                      </span>
                      <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {currentLesson.title}
                      </h1>
                    </div>
                    
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
                      {currentLesson.description || "Nenhuma descrição disponível para esta aula."}
                    </p>
                  </div>

                  {/* Actions Card */}
                  <div className="w-full md:w-72 bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText size={16} className="text-brand-500"/>
                      Arquivos do Projeto
                    </h3>
                    
                    {currentLesson.materialLink ? (
                      <a 
                        href={currentLesson.materialLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-brand-900/50 hover:shadow-brand-500/25 group"
                      >
                        <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                        Baixar Molde PDF
                      </a>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-zinc-600 bg-zinc-950/50 rounded-lg border border-zinc-800 border-dashed">
                        <FileText size={24} className="mb-2 opacity-50"/>
                        <span className="text-xs">Sem moldes disponíveis</span>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <p className="text-[10px] text-center text-zinc-500">
                        Precisa de ajuda com a costura?<br/>
                        <span className="text-zinc-300">kitofertaprospera@gmail.com</span>
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}

          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <Checkout 
          product={upgradeProduct} 
          onClose={() => setShowUpgradeModal(false)}
          onSuccess={handleUpgradeSuccess}
        />
      )}
    </div>
  );
};
