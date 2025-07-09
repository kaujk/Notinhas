import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Calendar, ArrowUpDown } from 'lucide-react';
import { Note } from '../types';

interface SearchFilterProps {
  notes: Note[];
  onFilter: (filteredNotes: Note[]) => void;
}

interface FilterState {
  op: string[];
  product: string[];
  color: string[];
  dateMode: 'specific' | 'month' | 'year' | 'range';
  specificDate: string;
  month: string;
  year: string;
  startDate: string;
  endDate: string;
}

type SortOrder = 'asc' | 'desc' | null;

export default function SearchFilter({ notes, onFilter }: SearchFilterProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    op: [],
    product: [],
    color: [],
    dateMode: 'specific',
    specificDate: '',
    month: '',
    year: '',
    startDate: '',
    endDate: '',
  });
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Get unique values for filter dropdowns
  const getUniqueValues = (field: keyof Pick<Note, 'op' | 'product'> | 'color') => {
    const values = new Set<string>();
    
    notes.forEach(note => {
      if (field === 'color') {
        note.colors.forEach(colorEntry => values.add(colorEntry.color));
      } else if (field === 'op') {
        values.add(note.op.toString());
      } else {
        values.add(note[field]);
      }
    });
    
    return Array.from(values).sort();
  };

  const getUniqueMonths = () => {
    const months = new Set<string>();
    notes.forEach(note => {
      const date = new Date(note.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthYear);
    });
    return Array.from(months).sort();
  };

  const getUniqueYears = () => {
    const years = new Set<string>();
    notes.forEach(note => {
      const date = new Date(note.date);
      years.add(date.getFullYear().toString());
    });
    return Array.from(years).sort();
  };

  const applyFilters = (search: string = searchTerm, filters: FilterState = activeFilters, sort: SortOrder = sortOrder) => {
    let filtered = [...notes];

    // Apply search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(note => 
        note.op.toString().includes(searchLower) ||
        note.product.toLowerCase().includes(searchLower) ||
        note.colors.some(color => color.color.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.op.length > 0) {
      filtered = filtered.filter(note => filters.op.includes(note.op.toString()));
    }
    
    if (filters.product.length > 0) {
      filtered = filtered.filter(note => filters.product.includes(note.product));
    }
    
    if (filters.color.length > 0) {
      filtered = filtered.filter(note => 
        note.colors.some(colorEntry => filters.color.includes(colorEntry.color))
      );
    }

    // Apply date filters
    if (filters.dateMode === 'specific' && filters.specificDate) {
      filtered = filtered.filter(note => note.date === filters.specificDate);
    } else if (filters.dateMode === 'month' && filters.month) {
      filtered = filtered.filter(note => {
        const noteDate = new Date(note.date);
        const noteMonth = `${noteDate.getFullYear()}-${String(noteDate.getMonth() + 1).padStart(2, '0')}`;
        return noteMonth === filters.month;
      });
    } else if (filters.dateMode === 'year' && filters.year) {
      filtered = filtered.filter(note => {
        const noteDate = new Date(note.date);
        return noteDate.getFullYear().toString() === filters.year;
      });
    } else if (filters.dateMode === 'range' && filters.startDate && filters.endDate) {
      filtered = filtered.filter(note => {
        const noteDate = new Date(note.date);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        return noteDate >= start && noteDate <= end;
      });
    }

    // Apply sorting
    if (sort) {
      filtered.sort((a, b) => {
        const comparison = a.product.localeCompare(b.product, 'pt-BR');
        return sort === 'asc' ? comparison : -comparison;
      });
    }

    onFilter(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, activeFilters, sortOrder);
  };

  const handleFilterChange = (field: keyof Pick<FilterState, 'op' | 'product' | 'color'>, value: string, checked: boolean) => {
    const newFilters = {
      ...activeFilters,
      [field]: checked 
        ? [...activeFilters[field], value]
        : activeFilters[field].filter(v => v !== value)
    };
    
    setActiveFilters(newFilters);
    applyFilters(searchTerm, newFilters, sortOrder);
  };

  const handleDateFilterChange = (field: keyof FilterState, value: string) => {
    const newFilters = { ...activeFilters, [field]: value };
    setActiveFilters(newFilters);
    applyFilters(searchTerm, newFilters, sortOrder);
  };

  const handleSort = (order: SortOrder) => {
    setSortOrder(order);
    setShowSort(false);
    applyFilters(searchTerm, activeFilters, order);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSortOrder(null);
    setActiveFilters({
      op: [],
      product: [],
      color: [],
      dateMode: 'specific',
      specificDate: '',
      month: '',
      year: '',
      startDate: '',
      endDate: '',
    });
    onFilter(notes);
  };

  const hasActiveFilters = searchTerm || 
    Object.values(activeFilters).some((value, index) => {
      if (index < 3) return (value as string[]).length > 0; // op, product, color
      if (index === 3) return false; // dateMode
      return value !== ''; // date values
    }) || 
    sortOrder !== null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Search Button */}
      <div className="relative">
        <button
          onClick={() => {
            setShowSearch(!showSearch);
            setShowFilter(false);
            setShowSort(false);
          }}
          className={`p-2 rounded-lg transition-colors ${
            searchTerm ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Pesquisar"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Search Panel */}
        {showSearch && (
          <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80 max-w-[90vw]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Pesquisar</h3>
              <button
                onClick={() => setShowSearch(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="OP, produto ou cor..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Limpar Pesquisa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={() => {
            setShowFilter(!showFilter);
            setShowSearch(false);
            setShowSort(false);
          }}
          className={`p-2 rounded-lg transition-colors relative ${
            hasActiveFilters ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Filtrar"
        >
          <Filter className="w-5 h-5" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full"></span>
          )}
        </button>

        {/* Filter Panel */}
        {showFilter && (
          <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* OP Filter */}
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'op' ? null : 'op')}
                  className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <span>OP ({activeFilters.op.length})</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'op' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'op' && (
                  <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                    {getUniqueValues('op').map(value => (
                      <label key={value} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.op.includes(value)}
                          onChange={(e) => handleFilterChange('op', value, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">#{value}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Filter */}
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'product' ? null : 'product')}
                  className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <span>Produto ({activeFilters.product.length})</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'product' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'product' && (
                  <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                    {getUniqueValues('product').map(value => (
                      <label key={value} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.product.includes(value)}
                          onChange={(e) => handleFilterChange('product', value, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">{value}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'color' ? null : 'color')}
                  className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <span>Cor ({activeFilters.color.length})</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'color' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'color' && (
                  <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                    {getUniqueValues('color').map(value => (
                      <label key={value} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.color.includes(value)}
                          onChange={(e) => handleFilterChange('color', value, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">{value}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Filter */}
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                  className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <span>Data</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'date' && (
                  <div className="mt-2 p-4 border border-gray-200 rounded-lg space-y-4">
                    {/* Date Mode Selector */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Modo de Filtro</label>
                      <select
                        value={activeFilters.dateMode}
                        onChange={(e) => handleDateFilterChange('dateMode', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="specific">📅 Dia específico</option>
                        <option value="month">🗓️ Mês</option>
                        <option value="year">📆 Ano</option>
                        <option value="range">🔁 Período</option>
                      </select>
                    </div>

                    {/* Date Inputs based on mode */}
                    {activeFilters.dateMode === 'specific' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Data</label>
                        <input
                          type="date"
                          value={activeFilters.specificDate}
                          onChange={(e) => handleDateFilterChange('specificDate', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {activeFilters.dateMode === 'month' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Mês</label>
                        <select
                          value={activeFilters.month}
                          onChange={(e) => handleDateFilterChange('month', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione um mês</option>
                          {getUniqueMonths().map(month => (
                            <option key={month} value={month}>{formatMonth(month)}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {activeFilters.dateMode === 'year' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Ano</label>
                        <select
                          value={activeFilters.year}
                          onChange={(e) => handleDateFilterChange('year', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione um ano</option>
                          {getUniqueYears().map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {activeFilters.dateMode === 'range' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Data Inicial</label>
                          <input
                            type="date"
                            value={activeFilters.startDate}
                            onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Data Final</label>
                          <input
                            type="date"
                            value={activeFilters.endDate}
                            onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sort Button */}
      <div className="relative">
        <button
          onClick={() => {
            setShowSort(!showSort);
            setShowSearch(false);
            setShowFilter(false);
          }}
          className={`p-2 rounded-lg transition-colors ${
            sortOrder ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Ordenar"
        >
          <ArrowUpDown className="w-5 h-5" />
        </button>

        {/* Sort Panel */}
        {showSort && (
          <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-48">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Ordenar por Produto</h3>
              <button
                onClick={() => setShowSort(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSort('asc')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  sortOrder === 'asc' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                A-Z (Crescente)
              </button>
              <button
                onClick={() => handleSort('desc')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  sortOrder === 'desc' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                Z-A (Decrescente)
              </button>
              {sortOrder && (
                <button
                  onClick={() => handleSort(null)}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Remover Ordenação
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {(showSearch || showFilter || showSort) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSearch(false);
            setShowFilter(false);
            setShowSort(false);
          }}
        />
      )}
    </div>
  );
}