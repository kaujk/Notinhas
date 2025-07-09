import React, { useState } from 'react';
import { Plus, Calendar, Package, Palette, CheckCircle, Clock, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';

interface NotesListProps {
  onAddNote: () => void;
  onViewNote: (note: Note) => void;
  filteredNotes?: Note[];
}

export default function NotesList({ onAddNote, onViewNote, filteredNotes }: NotesListProps) {
  const { user, notes } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  // Use filtered notes if provided, otherwise use all notes
  const notesToShow = filteredNotes || notes;

  const filteredByStatus = notesToShow.filter(note => {
    if (filter === 'pending') return !note.isConfirmed;
    if (filter === 'confirmed') return note.isConfirmed;
    return true;
  });

  const pendingCount = notes.filter(note => !note.isConfirmed).length;
  const confirmedCount = notes.filter(note => note.isConfirmed).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTotalQuantity = (note: Note) => {
    return note.colors.reduce((total, colorEntry) => 
      total + colorEntry.sizeQuantities.reduce((colorTotal, sq) => colorTotal + sq.quantity, 0), 0
    );
  };

  const getColorsDisplay = (note: Note) => {
    return note.colors.map(c => c.color).join(', ');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notas</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'soft-clean' 
              ? 'Gerenciar notas do serviço de lavanderia' 
              : 'Visualizar e confirmar suas notas de lavanderia'
            }
          </p>
          {filteredNotes && filteredNotes.length !== notes.length && (
            <p className="text-sm text-blue-600 mt-1">
              Mostrando {filteredNotes.length} de {notes.length} notas
            </p>
          )}
        </div>
        {user?.role === 'soft-clean' && (
          <button
            onClick={onAddNote}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Adicionar Nota
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Notas</p>
              <p className="text-2xl font-bold text-gray-900">{notes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Confirmadas</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
        {[
          { key: 'all', label: 'Todas as Notas', count: notesToShow.length },
          { key: 'pending', label: 'Pendentes', count: notesToShow.filter(n => !n.isConfirmed).length },
          { key: 'confirmed', label: 'Confirmadas', count: notesToShow.filter(n => n.isConfirmed).length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notes List */}
      {filteredByStatus.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma nota encontrada</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? (filteredNotes ? 'Nenhuma nota corresponde aos filtros aplicados.' : 'Nenhuma nota foi criada ainda.') 
              : `Nenhuma nota ${filter === 'pending' ? 'pendente' : 'confirmada'} no momento.`
            }
          </p>
          {user?.role === 'soft-clean' && filter === 'all' && !filteredNotes && (
            <button
              onClick={onAddNote}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Criar Primeira Nota
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredByStatus.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">OP</span>
                      <span className="font-bold text-gray-900">#{note.op}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      note.isConfirmed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {note.isConfirmed ? 'Confirmada' : 'Pendente'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Cliente:</span>
                      <span className="font-medium text-gray-900">{note.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium text-gray-900">{formatDate(note.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Produto:</span>
                      <span className="font-medium text-gray-900">{note.product}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Cores:</span>
                      <span className="font-medium text-gray-900">{getColorsDisplay(note)}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Quantidade Total:</span> {getTotalQuantity(note)} itens
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewNote(note)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}