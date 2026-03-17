import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Checkout } from './components/Checkout';
import { COURSE_CONTENT } from './data';
import { User, Product } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('atelier_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme and persist
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('atelier_theme', theme);
  }, [theme]);

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lumina_session_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setView('dashboard');
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  // Persist user data whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('lumina_session_user', JSON.stringify(user));
      
      // Also update the persistent database keyed by CPF
      const dbStr = localStorage.getItem('atelier_kids_db');
      const db = dbStr ? JSON.parse(dbStr) : {};
      db[user.cpf] = user;
      localStorage.setItem('atelier_kids_db', JSON.stringify(db));
    }
  }, [user]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('lumina_session_user');
    setUser(null);
    setView('landing');
  };

  const handleBuyProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  if (view === 'dashboard' && user) {
    return (
      <Dashboard 
        user={user} 
        modules={COURSE_CONTENT} 
        onLogout={handleLogout} 
        onUpdateUser={handleUpdateUser}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      />
    );
  }

  if (view === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <LandingPage 
        onLoginClick={() => setView('login')} 
        onBuyClick={handleBuyProduct} 
      />
      {selectedProduct && (
        <Checkout 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
};

export default App;
