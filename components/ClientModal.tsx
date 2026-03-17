import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Ruler, FileText, Save } from 'lucide-react';
import { Client, Measurement } from '../types';

interface ClientModalProps {
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'createdAt' | 'photos'>) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [notes, setNotes] = useState('');
  const [measurements, setMeasurements] = useState<Measurement>({
    bust: undefined,
    waist: undefined,
    hip: undefined,
    shoulder: undefined,
    armLength: undefined,
    totalLength: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, whatsapp, notes, measurements });
  };

  const handleMeasurementChange = (field: keyof Measurement, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value === '' ? undefined : parseFloat(value)
    }));
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 rounded-xl text-brand-600 dark:text-brand-500">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">Novo Cliente</h2>
              <p className="text-xs text-zinc-500">Cadastre os dados e medidas do cliente.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-brand-500" /> Dados Básicos
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nome Completo</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">WhatsApp</label>
                <input
                  required
                  type="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Observações</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Preferências, alergias, etc."
                  rows={3}
                  className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Ruler size={16} className="text-brand-500" /> Medidas (cm)
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Busto', field: 'bust' },
                  { label: 'Cintura', field: 'waist' },
                  { label: 'Quadril', field: 'hip' },
                  { label: 'Ombro', field: 'shoulder' },
                  { label: 'Manga', field: 'armLength' },
                  { label: 'Comprimento', field: 'totalLength' },
                ].map(item => (
                  <div key={item.field} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={measurements[item.field as keyof Measurement] || ''}
                      onChange={e => handleMeasurementChange(item.field as keyof Measurement, e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl hover:bg-zinc-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
