import React, { useState } from 'react';
import { Settings as SettingsIcon, Lock, Eye, EyeOff, Save, Upload, Image } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showPasswords, setShowPasswords] = useState({
    'soft-clean': false,
    'amil': false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordChange = (role: 'soft-clean' | 'amil', password: string) => {
    setLocalSettings(prev => ({
      ...prev,
      loginConfig: {
        ...prev.loginConfig,
        [role]: {
          ...prev.loginConfig[role],
          password,
        }
      }
    }));
  };

  const handleRequirePasswordChange = (role: 'soft-clean' | 'amil', requirePassword: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      loginConfig: {
        ...prev.loginConfig,
        [role]: {
          ...prev.loginConfig[role],
          requirePassword,
        }
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setLocalSettings(prev => ({
          ...prev,
          logo: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLocalSettings(prev => ({
      ...prev,
      logo: undefined,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      // Show success feedback
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = (role: 'soft-clean' | 'amil') => {
    setShowPasswords(prev => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(localSettings);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">
            Gerenciar configurações do sistema e controle de acesso
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Logo Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Image className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Logo da Empresa</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Configure o logo que aparece na tela de login
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-6">
              {/* Logo Preview */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {localSettings.logo ? (
                    <img
                      src={localSettings.logo}
                      alt="Logo"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Image className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Logo Controls */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload do Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Recomendado: PNG com fundo transparente, tamanho máximo 2MB
                  </p>
                </div>

                {localSettings.logo && (
                  <button
                    onClick={handleRemoveLogo}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Remover Logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Login Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Controle de Acesso</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Configure senhas para controlar o acesso ao sistema
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Soft Clean Settings */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Soft Clean (Admin)</h3>
                  <p className="text-sm text-gray-600">Configurações para acesso administrativo</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="softclean-require-password"
                    checked={localSettings.loginConfig['soft-clean'].requirePassword}
                    onChange={(e) => handleRequirePasswordChange('soft-clean', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="softclean-require-password" className="text-sm font-medium text-gray-700">
                    Exigir senha para acesso
                  </label>
                </div>

                {localSettings.loginConfig['soft-clean'].requirePassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords['soft-clean'] ? 'text' : 'password'}
                        value={localSettings.loginConfig['soft-clean'].password}
                        onChange={(e) => handlePasswordChange('soft-clean', e.target.value)}
                        className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Digite a senha"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('soft-clean')}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords['soft-clean'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Amil Settings */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Amil (Cliente)</h3>
                  <p className="text-sm text-gray-600">Configurações para acesso do cliente</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="amil-require-password"
                    checked={localSettings.loginConfig['amil'].requirePassword}
                    onChange={(e) => handleRequirePasswordChange('amil', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="amil-require-password" className="text-sm font-medium text-gray-700">
                    Exigir senha para acesso
                  </label>
                </div>

                {localSettings.loginConfig['amil'].requirePassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords['amil'] ? 'text' : 'password'}
                        value={localSettings.loginConfig['amil'].password}
                        onChange={(e) => handlePasswordChange('amil', e.target.value)}
                        className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Digite a senha"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('amil')}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords['amil'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Nota de Segurança</h4>
              <p className="text-sm text-amber-800">
                Se você desabilitar a senha para um perfil, qualquer pessoa poderá acessar o sistema 
                selecionando esse perfil. Recomendamos manter as senhas ativadas para maior segurança.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}