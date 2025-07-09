import React from 'react';
import { ArrowLeft, Calendar, Package, Palette, CheckCircle, Clock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';

interface NoteDetailsProps {
  note: Note;
  onBack: () => void;
}

export default function NoteDetails({ note, onBack }: NoteDetailsProps) {
  const { user, confirmNote } = useApp();

  const handleConfirm = () => {
    confirmNote(note.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalQuantity = () => {
    return note.colors.reduce((total, colorEntry) => 
      total + colorEntry.sizeQuantities.reduce((colorTotal, sq) => colorTotal + sq.quantity, 0), 0
    );
  };

  const getColorsDisplay = () => {
    return note.colors.map(c => c.color).join(', ');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-200">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Nota #{note.op}</h1>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                note.isConfirmed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {note.isConfirmed ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Confirmada
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Pendente
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600">Criada em {formatDateTime(note.createdAt)}</p>
            {note.confirmedAt && (
              <p className="text-sm text-green-600">Confirmada em {formatDateTime(note.confirmedAt)}</p>
            )}
          </div>
          {user?.role === 'amil' && !note.isConfirmed && (
            <button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <CheckCircle className="w-4 h-4" />
              Confirmar Nota
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-semibold text-gray-900">{note.client}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Produto</p>
                  <p className="font-semibold text-gray-900">{note.product}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cores</p>
                  <p className="font-semibold text-gray-900">{getColorsDisplay()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-semibold text-gray-900">{formatDate(note.date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colors & Quantities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tamanhos & Quantidades por Cor</h2>
              <div className="text-sm text-gray-600">
                Total: <span className="font-semibold text-gray-900">{getTotalQuantity()}</span> itens
              </div>
            </div>

            {note.colors.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Nenhuma quantidade registrada</p>
              </div>
            ) : (
              <div className="space-y-6">
                {note.colors.map((colorEntry, colorIndex) => (
                  <div key={colorIndex} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{colorEntry.color}</h3>
                      <div className="text-sm text-gray-600">
                        Subtotal: <span className="font-medium text-gray-900">
                          {colorEntry.sizeQuantities.reduce((total, sq) => total + sq.quantity, 0)}
                        </span> itens
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {colorEntry.sizeQuantities.map((sq, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-lg font-bold text-blue-600">{sq.sizeName}</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{sq.quantity}</p>
                            <p className="text-sm text-gray-600">itens</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Table */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h2>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tamanho</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Quantidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {note.colors.map((colorEntry, colorIndex) =>
                    colorEntry.sizeQuantities.map((sq, sizeIndex) => (
                      <tr key={`${colorIndex}-${sizeIndex}`} className="bg-white">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {sizeIndex === 0 ? colorEntry.color : ''}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{sq.sizeName}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">{sq.quantity}</td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="px-6 py-4 text-sm text-gray-900" colSpan={2}>Total</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{getTotalQuantity()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {user?.role === 'amil' && !note.isConfirmed && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Confirmação Necessária</h3>
              </div>
              <p className="text-orange-800 text-sm mb-4">
                Por favor, revise os detalhes acima e confirme se tudo está correto. Uma vez confirmada, 
                esta nota será marcada como aprovada e não poderá ser modificada.
              </p>
              <button
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirmar Nota
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}