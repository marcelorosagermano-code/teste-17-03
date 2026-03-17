import React, { useEffect, useState } from 'react';
import { Download, Share, Smartphone, PlusSquare, MoreVertical, Menu } from 'lucide-react';

interface InstallButtonProps {
  variant?: 'header' | 'floating';
}

export const InstallButton: React.FC<InstallButtonProps> = ({ variant = 'header' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Verificar se já está instalado
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone || 
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
    };
    
    checkStandalone();
    window.addEventListener('resize', checkStandalone); // Monitorar mudanças

    // 2. Detectar iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // 3. Capturar evento do Chrome/Android
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("Evento de instalação capturado!");
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('resize', checkStandalone);
    };
  }, []);

  const handleInstallClick = async () => {
    // Cenário 1: Chrome/Android com evento capturado (Instalação Automática)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      return;
    }

    // Cenário 2: iOS ou Android sem evento (Instalação Manual)
    // Mostra o tutorial
    setShowHint(true);
    setTimeout(() => setShowHint(false), 8000);
  };

  // Se já estiver rodando como App, não mostra nada
  if (isStandalone) return null;

  // Se for Header, só mostra se tivermos o prompt pronto (para não poluir a UI interna)
  if (variant === 'header' && !deferredPrompt && !isIOS) return null;

  // RENDERIZAÇÃO: MODO FLUTUANTE (LOGIN)
  if (variant === 'floating') {
    return (
      <div className="fixed bottom-8 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Dica / Tutorial */}
        {showHint && (
          <div className="mb-4 bg-zinc-900/95 border border-zinc-700 p-4 rounded-xl shadow-2xl max-w-xs mx-4 text-center animate-in fade-in slide-in-from-bottom-4 pointer-events-auto">
            <p className="text-white font-semibold mb-2 text-sm">
              {isIOS ? 'Instalar no iPhone:' : 'Instalar no Android:'}
            </p>
            
            {isIOS ? (
              <>
                <div className="flex items-center justify-center gap-2 text-zinc-300 text-xs mb-2">
                  1. Toque em Compartilhar <Share size={14} className="text-blue-500" />
                </div>
                <div className="flex items-center justify-center gap-2 text-zinc-300 text-xs">
                  2. Escolha <span className="font-bold text-white flex items-center gap-1"><PlusSquare size={14}/> Adicionar à Tela de Início</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-zinc-300 text-xs mb-2">
                  1. Toque no menu do navegador <MoreVertical size={14} />
                </div>
                <div className="flex items-center justify-center gap-2 text-zinc-300 text-xs">
                  2. Selecione <span className="font-bold text-white">Adicionar à tela inicial</span> ou <span className="font-bold text-white">Instalar aplicativo</span>
                </div>
              </>
            )}
            
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-b border-r border-zinc-700 transform rotate-45"></div>
          </div>
        )}

        <button
          onClick={handleInstallClick}
          className="pointer-events-auto flex items-center gap-3 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-lg shadow-brand-900/50 transition-all active:scale-95 animate-bounce-subtle border border-brand-500/50 backdrop-blur-md"
        >
          <Smartphone size={20} />
          <span className="font-semibold text-sm">Baixar Aplicativo</span>
        </button>
      </div>
    );
  }

  // RENDERIZAÇÃO: MODO HEADER (DASHBOARD)
  return (
    <div className="relative">
      <button
        onClick={handleInstallClick}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-xs font-medium text-zinc-300 transition-colors"
      >
        <Smartphone size={14} />
        <span>Instalar App</span>
      </button>

      {/* Versão Mobile (Ícone apenas) */}
      <button
        onClick={handleInstallClick}
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-zinc-300"
      >
        <Download size={16} />
      </button>

      {/* Dica para Header (Igual ao floating, mas posicionado diferente) */}
      {showHint && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 text-xs text-zinc-300">
          <p className="mb-2 font-semibold text-white">Para instalar:</p>
          {isIOS ? (
             <>
               <div className="flex items-center gap-2 mb-1">1. Toque em Compartilhar <Share size={12} /></div>
               <div className="flex items-center gap-2">2. "Adicionar à Tela de Início"</div>
             </>
          ) : (
             <>
               <div className="flex items-center gap-2 mb-1">1. Abra o menu <MoreVertical size={12} /></div>
               <div className="flex items-center gap-2">2. "Adicionar à tela inicial"</div>
             </>
          )}
        </div>
      )}
    </div>
  );
};