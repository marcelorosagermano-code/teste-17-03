import React, { useEffect, useState } from 'react';
import { X, Smartphone, Download, Share, PlusSquare, MoreVertical } from 'lucide-react';

export const InstallPwaModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already installed
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone || 
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
    };
    
    checkStandalone();

    // 2. Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // 3. Capture install event (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto-open modal when event is captured (or immediately if iOS)
      const hasClosed = localStorage.getItem('install_modal_closed');
      if (!hasClosed && !isStandalone) {
        setIsOpen(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, we don't get the event, so we just check standalone + session
    if (ios && !isStandalone) {
      const hasClosed = localStorage.getItem('install_modal_closed');
      if (!hasClosed) {
        // Small delay for iOS to not be instant
        setTimeout(() => setIsOpen(true), 1000);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsOpen(false);
      }
    } else if (isIOS) {
      // iOS doesn't support programmatic install, just show instructions (already visible)
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('install_modal_closed', 'true');
  };

  if (!isOpen || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 duration-500">
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-rose-900/50 transform -rotate-3">
            <Smartphone className="text-white w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Instalar Aplicativo</h3>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Instale o <span className="text-rose-500 font-bold">Atelier Kids</span> para acessar seus moldes offline e ter uma experiência melhor.
          </p>

          {isIOS ? (
            <div className="w-full bg-zinc-950/50 rounded-xl p-4 border border-zinc-800 mb-4 text-left">
              <p className="text-zinc-300 text-xs font-bold mb-3 text-center uppercase tracking-wider">Como instalar no iPhone:</p>
              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex items-center gap-3">
                  <Share size={16} className="text-blue-500 shrink-0" />
                  <span>1. Toque no botão <strong>Compartilhar</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <PlusSquare size={16} className="text-zinc-300 shrink-0" />
                  <span>2. Selecione <strong>Adicionar à Tela de Início</strong></span>
                </div>
              </div>
            </div>
          ) : (
             !deferredPrompt && (
              <div className="w-full bg-zinc-950/50 rounded-xl p-4 border border-zinc-800 mb-4 text-left">
                <p className="text-zinc-300 text-xs font-bold mb-3 text-center uppercase tracking-wider">Como instalar:</p>
                <div className="space-y-3 text-sm text-zinc-400">
                  <div className="flex items-center gap-3">
                    <MoreVertical size={16} className="text-zinc-300 shrink-0" />
                    <span>1. Toque no menu do navegador</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Download size={16} className="text-zinc-300 shrink-0" />
                    <span>2. Selecione <strong>Instalar aplicativo</strong></span>
                  </div>
                </div>
              </div>
             )
          )}

          {(!isIOS && deferredPrompt) && (
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Instalar Agora
            </button>
          )}

          <button 
            onClick={handleClose}
            className="mt-4 text-zinc-500 text-xs font-medium hover:text-zinc-300 transition-colors"
          >
            Continuar no navegador
          </button>
        </div>
      </div>
    </div>
  );
};
