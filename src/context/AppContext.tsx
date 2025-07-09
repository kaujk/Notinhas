import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, Size, User, AppSettings } from '../types';

interface AppContextType {
  user: User | null;
  notes: Note[];
  sizes: Size[];
  settings: AppSettings;
  setUser: (user: User | null) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'isConfirmed'>) => void;
  confirmNote: (noteId: string) => void;
  addSize: (name: string) => void;
  updateSize: (id: string, name: string) => void;
  deleteSize: (id: string) => void;
  reorderSizes: (sizes: Size[]) => void;
  updateSettings: (settings: AppSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSizes: Size[] = [
  { id: '1', name: 'P', order: 0 },
  { id: '2', name: 'M', order: 1 },
  { id: '3', name: 'G', order: 2 },
  { id: '4', name: 'GG', order: 3 },
];

const defaultSettings: AppSettings = {
  loginConfig: {
    'soft-clean': {
      requirePassword: false,
      password: '',
    },
    'amil': {
      requirePassword: false,
      password: '',
    },
  },
};

const mockNotes: Note[] = [
  {
    id: '1',
    op: 12345,
    client: 'Amil',
    product: 'Camiseta',
    colors: [
      {
        color: 'Branco',
        sizeQuantities: [
          { sizeId: '1', sizeName: 'P', quantity: 12 },
          { sizeId: '2', sizeName: 'M', quantity: 8 },
          { sizeId: '3', sizeName: 'G', quantity: 15 },
          { sizeId: '4', sizeName: 'GG', quantity: 5 },
        ]
      },
      {
        color: 'Azul',
        sizeQuantities: [
          { sizeId: '2', sizeName: 'M', quantity: 6 },
          { sizeId: '3', sizeName: 'G', quantity: 10 },
        ]
      }
    ],
    date: '2025-01-10',
    isConfirmed: false,
    createdAt: '2025-01-10T08:30:00Z',
  },
  {
    id: '2',
    op: 12346,
    client: 'Amil',
    product: 'Calça',
    colors: [
      {
        color: 'Preto',
        sizeQuantities: [
          { sizeId: '2', sizeName: 'M', quantity: 4 },
          { sizeId: '3', sizeName: 'G', quantity: 8 },
        ]
      }
    ],
    date: '2025-01-09',
    isConfirmed: true,
    createdAt: '2025-01-09T14:15:00Z',
    confirmedAt: '2025-01-09T16:20:00Z',
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [sizes, setSizes] = useState<Size[]>(defaultSizes);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('laundry-user');
    const savedNotes = localStorage.getItem('laundry-notes');
    const savedSizes = localStorage.getItem('laundry-sizes');
    const savedSettings = localStorage.getItem('laundry-settings');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedSizes) {
      setSizes(JSON.parse(savedSizes));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('laundry-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('laundry-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('laundry-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('laundry-sizes', JSON.stringify(sizes));
  }, [sizes]);

  useEffect(() => {
    localStorage.setItem('laundry-settings', JSON.stringify(settings));
  }, [settings]);

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'isConfirmed'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isConfirmed: false,
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const confirmNote = (noteId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? { ...note, isConfirmed: true, confirmedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const addSize = (name: string) => {
    const newSize: Size = {
      id: Date.now().toString(),
      name: name.trim(),
      order: sizes.length,
    };
    setSizes(prev => [...prev, newSize]);
  };

  const updateSize = (id: string, name: string) => {
    setSizes(prev =>
      prev.map(size =>
        size.id === id ? { ...size, name: name.trim() } : size
      )
    );
  };

  const deleteSize = (id: string) => {
    setSizes(prev => prev.filter(size => size.id !== id));
  };

  const reorderSizes = (newSizes: Size[]) => {
    setSizes(newSizes.map((size, index) => ({ ...size, order: index })));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        notes,
        sizes,
        settings,
        setUser,
        addNote,
        confirmNote,
        addSize,
        updateSize,
        deleteSize,
        reorderSizes,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}