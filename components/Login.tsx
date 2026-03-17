import React, { useState } from 'react';
import { ALLOWED_USERS } from '../data';
import { User } from '../types';
import { Lock, User as UserIcon, Loader2, ArrowRight, KeyRound, Scissors, ShieldCheck, X, Info } from 'lucide-react';
import { InstallButton } from './InstallButton';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for effect
    setTimeout(() => {
      // 1. Sanitize Input (Remove non-digits)
      const cleanCpf = cpf.replace(/\D/g, '');

      // 2. Validate Format (Simple check for length)
      if (cleanCpf.length !== 11) {
        setError('CPF inválido. Digite 11 números.');
        setIsLoading(false);
        return;
      }

      // 3. Validate Password (Must match first 4 digits of CPF)
      const expectedPassword = cleanCpf.substring(0, 4);
      if (password !== expectedPassword) {
        setError('Senha incorreta. Digite os 4 primeiros dígitos do CPF.');
        setIsLoading(false);
        return;
      }

      // 4. Check credentials logic
      const firstName = name.trim().split(' ')[0];
      
      // Check if user exists in the persistent "database"
      const dbStr = localStorage.getItem('atelier_kids_db');
      const db = dbStr ? JSON.parse(dbStr) : {};
      const savedUserData = db[cleanCpf];

      const existingUser = ALLOWED_USERS.find(u => u.cpf === cleanCpf);

      const userToLogin: User = savedUserData || (existingUser ? { ...existingUser, name: firstName || existingUser.name } : {
        cpf: cleanCpf,
        name: firstName || 'Costureira',
        active: true,
        plan: 'basic',
        stats: {
          completedLessons: [],
          totalSales: 0,
          monthlySales: [
            { month: 'Jan', amount: 0 },
            { month: 'Fev', amount: 0 },
            { month: 'Mar', amount: 0 },
          ],
          financialRecords: []
        }
      });

      // If it's a returning user but they entered a new name, we could update it, 
      // but usually we want to keep their saved data. 
      // Let's ensure the name is at least set if it was empty.
      if (firstName && userToLogin.name === 'Costureira') {
        userToLogin.name = firstName;
      }

      onLoginSuccess(userToLogin);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      
      {/* Botão de Instalar Flutuante */}
      <InstallButton variant="floating" />

      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-400/5 dark:bg-brand-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-2xl transition-colors duration-500">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-600 rounded-xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-brand-600/30 transform rotate-3">
              <Scissors className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Atelier Kids</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Portal de Moldes e Aulas Exclusivas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 ml-1">
                Seu Nome (Obrigatório)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Como quer ser chamada?"
                />
              </div>
            </div>

            {/* CPF Field */}
            <div>
              <label htmlFor="cpf" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 ml-1">
                CPF (Somente Números)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setCpf(val);
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 ml-1">
                Senha (4 primeiros dígitos do CPF)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setPassword(val);
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="••••"
                  inputMode="numeric"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start gap-3 px-1 py-2">
              <div className="flex items-center h-5">
                <input
                  id="agreement"
                  type="checkbox"
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-black/50 text-brand-600 focus:ring-brand-500 focus:ring-offset-white dark:focus:ring-offset-black transition-all cursor-pointer"
                />
              </div>
              <label htmlFor="agreement" className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight cursor-pointer select-none">
                Estou ciente e concordo com a <button type="button" onClick={() => setShowPolicy(true)} className="text-brand-600 dark:text-brand-500 hover:underline font-bold">Política de Uso e Privacidade de Dados</button> do Atelier Kids.
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !name.trim() || cpf.length < 11 || password.length < 4 || !agreedToPolicy}
              className={`
                w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white 
                transition-all duration-300 transform
                ${isLoading || !name.trim() || cpf.length < 11 || password.length < 4 || !agreedToPolicy
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-900 hover:scale-[1.02]'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Acessar Atelier</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button 
              onClick={() => setShowPolicy(true)}
              className="flex items-center justify-center gap-1.5 mx-auto text-[10px] text-zinc-500 hover:text-brand-400 transition-colors"
            >
              <ShieldCheck size={12} />
              Política de Uso e Privacidade de Dados
            </button>

            <p className="text-[10px] text-zinc-600">
              Caso tenha esquecido sua senha, tente os 4 primeiros dígitos do CPF.
              <br />
              Dúvidas? <a href="#" className="text-brand-500 hover:underline">Fale com o suporte.</a>
            </p>
          </div>
        </div>
      </div>

      {/* Data Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowPolicy(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-brand-500/10 rounded-xl text-brand-600 dark:text-brand-500">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Política de Dados e Uso</h2>
            </div>

            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <section className="space-y-2">
                <h3 className="text-zinc-900 dark:text-white font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                  Onde seus dados são salvos?
                </h3>
                <p>
                  Para sua total privacidade e segurança, o <strong>Atelier Kids</strong> salva todas as suas informações financeiras e de progresso <strong>exclusivamente no seu dispositivo</strong> (celular ou computador). Nós não enviamos seus dados para servidores externos.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-zinc-900 dark:text-white font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                  Como não perder suas informações?
                </h3>
                <p>
                  Seus dados estão vinculados ao seu CPF e ao navegador que você está usando agora. Eles permanecerão salvos mesmo se você sair do aplicativo ou fechar a aba. No entanto, eles serão apagados se:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 dark:text-zinc-500">
                  <li>Você limpar o histórico/cache do seu navegador.</li>
                  <li>Você formatar seu aparelho.</li>
                  <li>Você usar o modo de navegação anônima.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-zinc-900 dark:text-white font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                  Acesso em múltiplos aparelhos
                </h3>
                <p>
                  Como os dados são locais, se você cadastrar uma venda no celular, ela não aparecerá automaticamente no seu computador. Cada aparelho funciona como um banco de dados independente.
                </p>
              </section>

              <section className="bg-brand-500/5 border border-brand-500/20 p-4 rounded-2xl">
                <div className="flex gap-3">
                  <Info size={20} className="text-brand-600 dark:text-brand-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-brand-700 dark:text-brand-200/80 italic">
                    Ao utilizar este aplicativo, você concorda que o <strong>Atelier Kids</strong> é uma ferramenta de auxílio à gestão e não se responsabiliza por eventuais perdas de dados decorrentes de limpeza de cache, troca de dispositivos ou mau uso da ferramenta. Recomendamos sempre manter um backup manual de suas informações mais importantes.
                  </p>
                </div>
              </section>
            </div>

            <button 
              onClick={() => setShowPolicy(false)}
              className="w-full mt-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Entendi e Aceito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};