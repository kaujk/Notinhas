import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Calendar, X, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ColorEntry, ColorSizeQuantity } from '../types';

interface AddNoteFormProps {
  onBack: () => void;
}

const colors = [
  'Branco', 'Preto', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Laranja', 'Roxo', 'Rosa', 'Marrom', 'Azul Marinho'
];

const clients = ['Amil'];

export default function AddNoteForm({ onBack }: AddNoteFormProps) {
  const { sizes, addNote } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    op: '',
    client: 'Amil',
    product: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorEntries, setColorEntries] = useState<ColorEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleColorSelection = (color: string) => {
    if (selectedColors.includes(color)) {
      // Remove color
      setSelectedColors(prev => prev.filter(c => c !== color));
      setColorEntries(prev => prev.filter(entry => entry.color !== color));
    } else {
      // Add color
      setSelectedColors(prev => [...prev, color]);
      setColorEntries(prev => [...prev, {
        color,
        sizeQuantities: sizes.map(size => ({
          sizeId: size.id,
          sizeName: size.name,
          quantity: 0,
        }))
      }]);
    }
  };

  const updateColorQuantity = (color: string, sizeId: string, quantity: number) => {
    setColorEntries(prev =>
      prev.map(entry =>
        entry.color === color
          ? {
              ...entry,
              sizeQuantities: entry.sizeQuantities.map(sq =>
                sq.sizeId === sizeId ? { ...sq, quantity: Math.max(0, quantity) } : sq
              )
            }
          : entry
      )
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.op) {
      newErrors.op = 'Número OP é obrigatório';
    } else if (isNaN(Number(formData.op)) || Number(formData.op) <= 0) {
      newErrors.op = 'OP deve ser um número positivo válido';
    }

    if (!formData.product.trim()) {
      newErrors.product = 'Produto é obrigatório';
    }

    if (selectedColors.length === 0) {
      newErrors.colors = 'Selecione pelo menos uma cor';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    // Check if at least one color has quantities
    const hasQuantities = colorEntries.some(entry =>
      entry.sizeQuantities.some(sq => sq.quantity > 0)
    );

    if (!hasQuantities) {
      newErrors.quantities = 'Pelo menos uma cor deve ter quantidades maiores que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out colors with no quantities
      const validColorEntries = colorEntries
        .map(entry => ({
          ...entry,
          sizeQuantities: entry.sizeQuantities.filter(sq => sq.quantity > 0)
        }))
        .filter(entry => entry.sizeQuantities.length > 0);

      await addNote({
        op: Number(formData.op),
        client: formData.client,
        product: formData.product.trim(),
        colors: validColorEntries,
        date: formData.date,
      });

      onBack();
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalQuantity = () => {
    return colorEntries.reduce((total, entry) =>
      total + entry.sizeQuantities.reduce((colorTotal, sq) => colorTotal + sq.quantity, 0), 0
    );
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Adicionar Nova Nota</h1>
            <p className="text-gray-600">Criar uma nova nota de serviço de lavanderia</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="op" className="block text-sm font-medium text-gray-700 mb-2">
                Número OP *
              </label>
              <input
                type="number"
                id="op"
                value={formData.op}
                onChange={(e) => setFormData(prev => ({ ...prev, op: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.op ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Digite o número OP"
              />
              {errors.op && <p className="mt-2 text-sm text-red-600">{errors.op}</p>}
            </div>

            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                id="client"
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {clients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                Produto *
              </label>
              <input
                type="text"
                id="product"
                value={formData.product}
                onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.product ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="ex: Camiseta, Calça, Vestido"
              />
              {errors.product && <p className="mt-2 text-sm text-red-600">{errors.product}</p>}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
            </div>
          </div>

          {/* Color Selection - Multiselect Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cores *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left flex items-center justify-between ${
                  errors.colors ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <span className={selectedColors.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                  {selectedColors.length === 0 
                    ? 'Selecione as cores' 
                    : `${selectedColors.length} cor${selectedColors.length > 1 ? 'es' : ''} selecionada${selectedColors.length > 1 ? 's' : ''}`
                  }
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isColorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isColorDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {colors.map((color) => (
                    <label
                      key={color}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => handleColorSelection(color)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-900">{color}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {selectedColors.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedColors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => handleColorSelection(color)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {errors.colors && <p className="mt-2 text-sm text-red-600">{errors.colors}</p>}
          </div>

          {/* Color Tabs & Quantities */}
          {selectedColors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tamanhos & Quantidades</h3>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-medium text-gray-900">{getTotalQuantity()}</span> itens
                </div>
              </div>

              {sizes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Nenhum tamanho configurado. Adicione tamanhos primeiro.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedColors.map((color) => {
                    const colorEntry = colorEntries.find(entry => entry.color === color);
                    if (!colorEntry) return null;

                    return (
                      <div key={color} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900">{color}</h4>
                          <button
                            type="button"
                            onClick={() => handleColorSelection(color)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                          {colorEntry.sizeQuantities.map((sq) => (
                            <div key={sq.sizeId} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-center mb-3">
                                <span className="font-semibold text-gray-900 text-lg">{sq.sizeName}</span>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateColorQuantity(color, sq.sizeId, sq.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  disabled={sq.quantity <= 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <input
                                  type="number"
                                  value={sq.quantity}
                                  onChange={(e) => updateColorQuantity(color, sq.sizeId, parseInt(e.target.value) || 0)}
                                  className="w-16 text-center border border-gray-300 rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  min="0"
                                />
                                <button
                                  type="button"
                                  onClick={() => updateColorQuantity(color, sq.sizeId, sq.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {errors.quantities && <p className="mt-2 text-sm text-red-600">{errors.quantities}</p>}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Criando...' : 'Criar Nota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}