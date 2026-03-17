import React, { useState } from 'react';
import { Product } from '../types';
import { X, Lock, CreditCard, CheckCircle } from 'lucide-react';

interface CheckoutProps {
  product: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ product, onClose, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      if (onSuccess) {
        // Wait a bit before calling onSuccess to let the user see the success message
        setTimeout(onSuccess, 2000);
      }
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300 transition-colors duration-500">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Pagamento Confirmado!</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Enviamos o link de download do <strong>{product.title}</strong> para o seu e-mail.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            Voltar para a Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full md:max-w-lg md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 transition-colors duration-500">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Lock size={16} className="text-green-600 dark:text-green-500" />
            Checkout Seguro
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-6 bg-rose-50/50 dark:bg-rose-500/5 border-b border-rose-100 dark:border-rose-500/10 flex gap-4">
          <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white line-clamp-1">{product.title}</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{product.category}</p>
            <div className="font-bold text-rose-600 dark:text-rose-500">R$ {product.price.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Nome Completo</label>
            <input required type="text" className="w-full p-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="Seu nome" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">E-mail</label>
            <input required type="email" className="w-full p-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="seu@email.com" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Cartão de Crédito</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3.5 text-zinc-400 dark:text-zinc-500 w-5 h-5" />
              <input required type="text" className="w-full pl-10 p-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="0000 0000 0000 0000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Validade</label>
              <input required type="text" className="w-full p-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="MM/AA" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">CVV</label>
              <input required type="text" className="w-full p-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="123" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 dark:shadow-green-900/20 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Processando...' : `Pagar R$ ${product.price.toFixed(2).replace('.', ',')}`}
          </button>
          
          <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1">
            <Lock size={10} />
            Seus dados estão protegidos por criptografia de ponta a ponta.
          </p>
        </form>
      </div>
    </div>
  );
};
