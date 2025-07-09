import React, { useState } from 'react';
import { Shirt, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SearchFilter from './SearchFilter';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  filteredNotes?: any[];
  onNotesFilter?: (notes: any[]) => void;
}

export default function Layout({ children, currentView, onViewChange, filteredNotes, onNotesFilter }: LayoutProps) {
  const { user, setUser, notes } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('laundry-user');
  };

  const pendingCount = notes.filter(note => !note.isConfirmed).length;

  const menuItems = [
    { id: 'notes', label: 'Notas', icon: FileText, badge: pendingCount > 0 ? pendingCount : null },
    ...(user?.role === 'soft-clean' ? [
      { id: 'sizes', label: 'Tamanhos', icon: Settings, badge: null },
      { id: 'settings', label: 'Configurações', icon: Settings, badge: null }
    ] : []),
  ];

  const showSearchFilter = currentView === 'notes' && onNotesFilter;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Sistema de Lavanderia</h1>
              <p className="text-xs text-gray-500">{user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search/Filter for mobile */}
            {showSearchFilter && (
              <SearchFilter notes={notes} onFilter={onNotesFilter} />
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 p-6 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Sistema de Lavanderia</h1>
                <p className="text-sm text-gray-500">{user?.name}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onViewChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        currentView === item.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header with Search/Filter */}
          <div className="hidden lg:block bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-end">
              {showSearchFilter && (
                <SearchFilter notes={notes} onFilter={onNotesFilter} />
              )}
            </div>
          </div>
          
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}