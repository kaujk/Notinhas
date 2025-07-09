import React, { useState } from 'react';
import { Shirt, User, Lock, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { setUser, settings } = useApp();
  const [selectedRole, setSelectedRole] = useState<'soft-clean' | 'amil' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelection = (role: 'soft-clean' | 'amil') => {
    const roleSettings = settings.loginConfig[role];
    
    if (!roleSettings.requirePassword) {
      // Login directly without password
      setUser({
        role,
        name: role === 'soft-clean' ? 'Soft Clean' : 'Amil',
      });
    } else {
      // Show password screen
      setSelectedRole(role);
      setPassword('');
      setError('');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) return;
    
    const roleSettings = settings.loginConfig[selectedRole];
    
    if (password === roleSettings.password) {
      setUser({
        role: selectedRole,
        name: selectedRole === 'soft-clean' ? 'Soft Clean' : 'Amil',
      });
    } else {
      setError('Senha incorreta');
      setPassword('');
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setPassword('');
    setError('');
  };

  // Password screen
  if (selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shirt className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Lavanderia</h1>
            <p className="text-gray-600">Digite a senha para {selectedRole === 'soft-clean' ? 'Soft Clean' : 'Amil'}</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  autoFocus
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Entrar
              </button>
              
              <button
                type="button"
                onClick={handleBack}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Role selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center">
                <Shirt className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Lavanderia</h1>
          <p className="text-gray-600">Sistema digital de gestão de notas</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection('soft-clean')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Shirt className="w-5 h-5" />
            Entrar como Soft Clean
            <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">Admin</span>
          </button>

          <button
            onClick={() => handleRoleSelection('amil')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <User className="w-5 h-5" />
            Entrar como Amil
            <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Cliente</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Escolha seu perfil para acessar o sistema</p>
        </div>
      </div>
    </div>
  );
}