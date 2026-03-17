import React, { useState } from 'react';
import { ShoppingBag, Star, Scissors, Check, ArrowRight, User, X } from 'lucide-react';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface LandingPageProps {
  onLoginClick: () => void;
  onBuyClick: (product: Product) => void;
}

const Modal = ({ title, content, onClose }: { title: string; content: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] text-zinc-300 leading-relaxed space-y-4">
        {content}
      </div>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onBuyClick }) => {
  const [activeModal, setActiveModal] = useState<{title: string, content: React.ReactNode} | null>(null);

  const footerLinks = [
    {
      label: "Sobre Nós",
      title: "Sobre a Atelier Kids",
      content: (
        <>
          <p>A Atelier Kids nasceu do sonho de democratizar a costura infantil de alta qualidade. Fundada em 2020, nossa missão é empoderar mães, avós e empreendedoras através do ensino da costura e modelagem.</p>
          <p>Hoje somos a maior plataforma de moldes infantis do Brasil, com mais de 3.000 alunas satisfeitas e uma comunidade vibrante de costureiras apaixonadas.</p>
          <p>Nossos moldes são desenvolvidos por modelistas experientes e testados rigorosamente para garantir o caimento perfeito em cada tamanho da grade.</p>
        </>
      )
    },
    {
      label: "Política de Privacidade",
      title: "Política de Privacidade",
      content: (
        <>
          <p>Sua privacidade é importante para nós. É política do Atelier Kids respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Atelier Kids, e outros sites que possuímos e operamos.</p>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
          <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
        </>
      )
    },
    {
      label: "Termos de Uso",
      title: "Termos de Uso",
      content: (
        <>
          <p>1. Termos</p>
          <p>Ao acessar ao site Atelier Kids, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
          <p>2. Uso de Licença</p>
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Atelier Kids , apenas para visualização transitória pessoal e não comercial.</p>
          <p>3. Isenção de responsabilidade</p>
          <p>Os materiais no site da Atelier Kids são fornecidos 'como estão'. Atelier Kids não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30">
      {activeModal && (
        <Modal 
          title={activeModal.title} 
          content={activeModal.content} 
          onClose={() => setActiveModal(null)} 
        />
      )}
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center transform -rotate-3 shadow-lg shadow-rose-900/50">
              <Scissors className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Atelier Kids</span>
          </div>
          
          <button 
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
          >
            <User size={18} />
            <span>Área do Aluno</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-10 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-zinc-950 to-zinc-950 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1624671611763-4c548b19447d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mask-image-gradient mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            <Star size={12} fill="currentColor" />
            Moldes Profissionais
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1]">
            Bem-vinda ao Seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">Universo da Costura</span> Infantil
          </h1>
          
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Um espaço exclusivo e <span className="underline decoration-rose-500 underline-offset-4 decoration-2 text-zinc-200">personalizado para você</span> criar peças incríveis com moldes perfeitos.
            Comece a costurar hoje mesmo, mesmo sendo iniciante.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#produtos" className="w-full sm:w-auto px-8 py-4 bg-rose-600 text-white rounded-full font-bold text-lg shadow-xl shadow-rose-900/20 hover:bg-rose-500 hover:scale-105 transition-all flex items-center justify-center gap-2">
              Ver o que vou aprender
              <ArrowRight size={20} />
            </a>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 overflow-hidden">
                    <img src={`https://randomuser.me/api/portraits/women/${i + 40}.jpg`} alt="Aluna" />
                  </div>
                ))}
              </div>
              <span>+3.000 alunas satisfeitas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-zinc-900/50 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Grade Completa",
                desc: "Tamanhos do RN ao 12 anos, testados em crianças reais para garantir o caimento perfeito.",
                icon: <Scissors className="w-5 h-5 text-rose-500" />
              },
              {
                title: "Vídeo Aulas",
                desc: "Todo molde acompanha um vídeo passo a passo da costura, do corte ao acabamento.",
                icon: <Check className="w-5 h-5 text-rose-500" />
              },
              {
                title: "Download Imediato",
                desc: "Receba os arquivos em PDF (A4 e Plotter) no seu Google Drive para baixar e acessar no seu aparelho.",
                icon: <ShoppingBag className="w-5 h-5 text-rose-500" />
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start text-left p-4 rounded-xl hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-800 gap-3">
                <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center shrink-0 border border-rose-500/20">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Gallery */}
      <section id="produtos" className="pt-6 pb-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Coleção Exclusiva</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Escolha seu próximo projeto e comece a costurar peças que encantam.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-zinc-800 hover:border-rose-500/30 transition-all duration-300 group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-block px-3 py-1 bg-rose-600/90 backdrop-blur-sm rounded-lg text-xs font-bold text-white mb-2 shadow-lg">
                      {product.category}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Preço Sugerido de Venda</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-400">
                        R$ {product.suggestedPrice?.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium bg-zinc-800 px-2 py-1 rounded-full">
                        {product.unit || '/peça'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pt-4 pb-12 bg-rose-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O que dizem nossas alunas</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Mariana Silva",
                role: "Mãe e Costureira",
                text: "Nunca tinha costurado nada. Com os vídeos da Atelier Kids, fiz o vestido de aniversário da minha filha. Ficou perfeito!",
                image: "https://i.postimg.cc/8CFYpxNk/Screenshot-2.jpg"
              },
              {
                name: "Carla Dias",
                role: "Dona de Atelier",
                text: "Os moldes têm um caimento impecável. Minhas clientes amam e eu economizo muito tempo na modelagem.",
                image: "https://i.postimg.cc/hGJYDNcP/Screenshot-3.jpg"
              },
              {
                name: "Fernanda Oliveira",
                role: "Empreendedora",
                text: "O aplicativo é super fácil de usar! Baixo os moldes direto no celular e assisto as aulas enquanto costuro. A organização é perfeita.",
                image: "https://i.postimg.cc/nLsWFNpL/Screenshot-4.jpg"
              }
            ].map((t, i) => (
              <div key={i} className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-rose-500/20 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-rose-500/50" />
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-rose-400 uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
                <p className="text-zinc-300 italic leading-relaxed">"{t.text}"</p>
                <div className="flex gap-1 mt-4 text-rose-500">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-zinc-500 py-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                <Scissors className="text-zinc-400 w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">Atelier Kids</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              Transformando tecidos em sonhos. A maior plataforma de moldes infantis do Brasil.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => setActiveModal({ title: link.title, content: link.content })}
                    className="hover:text-rose-500 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:kitofertaprospera@gmail.com" className="hover:text-rose-500 transition-colors">
                  kitofertaprospera@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-zinc-900 text-center text-xs">
          © 2026 Atelier Kids. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};
