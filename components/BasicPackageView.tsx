import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, Zap, Layers, Aperture } from 'lucide-react';
import { BASIC_PACKAGE_CATEGORIES } from '../data';

export const BasicPackageView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickFilters = ['Baby Look', 'Camisetas', 'Polo', 'Regatas', 'Calças', 'Moletons', 'Shorts', 'Bermudas', 'Íntimas', 'Pijamas', 'Escolar', 'Bebê', 'Conjuntos'];

  // File counts mapping
  const categoryCounts: { [key: string]: number } = {
    '01': 6,
    '02': 11,
    '03': 11,
    '04': 3,
    '05': 6,
    '06': 6,
    '07': 13,
    '08': 5,
    '09': 13,
    '10': 7,
    '11': 17,
    '12': 26,
    '13': 15,
    '14': 14,
    '15': 49
  };

  const filteredCategories = BASIC_PACKAGE_CATEGORIES.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter ? category.title.toLowerCase().includes(activeFilter.toLowerCase()) : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-white selection:bg-rose-500/30 pb-24 relative overflow-hidden transition-colors duration-500">
      
      {/* Ambient Background Effects - NO NOISE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-500/5 dark:bg-rose-600/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse duration-[5000ms]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Futuristic Header */}
        <header className="mb-12 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-rose-500"></div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-500">Sua Área de Criação</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-600 leading-[0.9]">
            BIBLIOTECA
          </h1>

          {/* Search HUD */}
          <div className={`sticky top-4 z-40 transition-all duration-300 ${scrolled ? 'scale-95' : ''}`}>
            <div className="relative group max-w-2xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-blue-500 rounded-2xl opacity-30 group-focus-within:opacity-100 transition duration-500 blur"></div>
              <div className="relative bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl rounded-2xl border border-zinc-200 dark:border-white/10 flex items-center p-2 shadow-2xl">
                <div className="pl-4 pr-3 text-zinc-400 dark:text-zinc-500">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-0 focus:outline-none text-lg font-medium h-12"
                  placeholder="Buscar arquivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide mask-image-gradient-right">
            {quickFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                className={`
                  relative px-6 py-2.5 rounded-full text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-300
                  ${activeFilter === filter 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg scale-105' 
                    : 'bg-white dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20'}
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCategories.map((category, idx) => {
            const isNew = parseInt(category.id) > 12 || category.id.includes('BÔNUS');
            const title = category.title.replace(/^\d+\s*-\s*/, '').replace('BÔNUS - ', '');
            const count = categoryCounts[category.id] || 0;
            
            return (
              <div 
                key={category.id}
                className="group relative h-[400px] sm:h-[450px] rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-500 shadow-sm hover:shadow-xl transform-gpu isolation-isolate"
              >
                {/* Image Layer - NO NOISE */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                </div>

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-end items-start z-20">
                  {isNew && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-500/50 text-[10px] font-bold text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
                      <Zap size={10} fill="currentColor" /> Novo
                    </div>
                  )}
                </div>

                {/* Content Layer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-500">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-3xl lg:text-2xl font-black text-white leading-tight mb-2 tracking-tight drop-shadow-lg">
                        {title}
                      </h3>
                      <div className="h-1 w-12 bg-rose-500 rounded-full mx-auto group-hover:w-full transition-all duration-500"></div>
                    </div>

                    <div className="flex items-center justify-center mt-6 gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 dark:bg-zinc-800/50 backdrop-blur-md border border-white/10 text-xs font-bold text-zinc-200 dark:text-zinc-300 whitespace-nowrap">
                        <Layers size={14} className="text-rose-500" />
                        <span>{count} Arquivos</span>
                      </div>
                      
                      <button 
                        onClick={() => category.link && window.open(category.link, '_blank')}
                        className="px-8 py-3.5 rounded-full bg-white text-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-white/20 cursor-pointer z-30"
                      >
                        <ArrowRight size={18} className="shrink-0" />
                        <span className="text-xs font-black tracking-wider">ACESSAR</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Border */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-[2rem] transition-colors duration-500 pointer-events-none z-30"></div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-zinc-200 dark:border-white/5 rounded-3xl bg-white dark:bg-white/5 backdrop-blur-sm shadow-sm">
            <Aperture size={48} className="text-zinc-400 dark:text-zinc-600 mb-4 animate-spin-slow" />
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Dados não encontrados</h3>
            <p className="text-zinc-500">Ajuste seus filtros de busca para localizar os arquivos.</p>
          </div>
        )}
      </div>
    </div>
  );
};
