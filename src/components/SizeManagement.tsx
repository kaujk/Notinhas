import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Size } from '../types';

export default function SizeManagement() {
  const { sizes, addSize, updateSize, deleteSize, reorderSizes } = useApp();
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [newSizeName, setNewSizeName] = useState('');
  const [editingSize, setEditingSize] = useState<string | null>(null);
  const [editSizeName, setEditSizeName] = useState('');

  const handleAddSize = () => {
    if (newSizeName.trim()) {
      addSize(newSizeName);
      setNewSizeName('');
      setIsAddingSize(false);
    }
  };

  const handleEditSize = (size: Size) => {
    setEditingSize(size.id);
    setEditSizeName(size.name);
  };

  const handleSaveEdit = () => {
    if (editingSize && editSizeName.trim()) {
      updateSize(editingSize, editSizeName);
      setEditingSize(null);
      setEditSizeName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSize(null);
    setEditSizeName('');
  };

  const handleDeleteSize = (sizeId: string) => {
    if (confirm('Tem certeza que deseja excluir este tamanho? Esta ação não pode ser desfeita.')) {
      deleteSize(sizeId);
    }
  };

  const moveSize = (fromIndex: number, toIndex: number) => {
    const newSizes = [...sizes];
    const [movedSize] = newSizes.splice(fromIndex, 1);
    newSizes.splice(toIndex, 0, movedSize);
    reorderSizes(newSizes);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Tamanhos</h1>
          <p className="text-gray-600 mt-1">
            Gerenciar tamanhos disponíveis para itens de lavanderia
          </p>
        </div>
        <button
          onClick={() => setIsAddingSize(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Adicionar Tamanho
        </button>
      </div>

      {/* Add New Size Form */}
      {isAddingSize && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Tamanho</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSizeName}
              onChange={(e) => setNewSizeName(e.target.value)}
              placeholder="Digite o nome do tamanho (ex: XL, XXL)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
              autoFocus
            />
            <button
              onClick={handleAddSize}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Adicionar
            </button>
            <button
              onClick={() => {
                setIsAddingSize(false);
                setNewSizeName('');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Sizes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tamanhos Disponíveis</h2>
          <p className="text-gray-600 text-sm mt-1">
            {sizes.length} tamanho{sizes.length !== 1 ? 's' : ''} configurado{sizes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {sizes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum tamanho configurado</h3>
            <p className="text-gray-600 mb-4">
              Adicione seu primeiro tamanho para começar a organizar itens de lavanderia.
            </p>
            <button
              onClick={() => setIsAddingSize(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Adicionar Primeiro Tamanho
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sizes
              .sort((a, b) => a.order - b.order)
              .map((size, index) => (
                <div
                  key={size.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Drag Handle */}
                  <button
                    className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                    title="Arrastar para reordenar"
                  >
                    <GripVertical className="w-5 h-5" />
                  </button>

                  {/* Size Name */}
                  <div className="flex-1">
                    {editingSize === size.id ? (
                      <input
                        type="text"
                        value={editSizeName}
                        onChange={(e) => setEditSizeName(e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-blue-600">{size.name}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{size.name}</p>
                          <p className="text-sm text-gray-500">Posição {index + 1}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {editingSize === size.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Salvar alterações"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Cancelar edição"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditSize(size)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar tamanho"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSize(size.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir tamanho"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {sizes.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              💡 <strong>Dica:</strong> Use a alça de arrastar (<GripVertical className="w-4 h-4 inline" />) para reordenar tamanhos. 
              A ordem aqui determina como eles aparecem no formulário de criação de notas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}