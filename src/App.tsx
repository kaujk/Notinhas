import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Layout from './components/Layout';
import NotesList from './components/NotesList';
import AddNoteForm from './components/AddNoteForm';
import NoteDetails from './components/NoteDetails';
import SizeManagement from './components/SizeManagement';
import Settings from './components/Settings';
import { Note } from './types';

function AppContent() {
  const { user, notes } = useApp();
  const [currentView, setCurrentView] = useState('notes');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);

  // Update filtered notes when notes change
  React.useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  if (!user) {
    return <LoginScreen />;
  }

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setCurrentView('note-details');
  };

  const handleBackToNotes = () => {
    setSelectedNote(null);
    setCurrentView('notes');
  };

  const handleNotesFilter = (filtered: Note[]) => {
    setFilteredNotes(filtered);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'add-note':
        return <AddNoteForm onBack={handleBackToNotes} />;
      case 'note-details':
        return selectedNote ? (
          <NoteDetails note={selectedNote} onBack={handleBackToNotes} />
        ) : (
          <NotesList 
            onAddNote={() => setCurrentView('add-note')} 
            onViewNote={handleViewNote}
            filteredNotes={filteredNotes}
          />
        );
      case 'sizes':
        return <SizeManagement />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <NotesList 
            onAddNote={() => setCurrentView('add-note')} 
            onViewNote={handleViewNote}
            filteredNotes={filteredNotes}
          />
        );
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView}
      filteredNotes={currentView === 'notes' ? filteredNotes : undefined}
      onNotesFilter={currentView === 'notes' ? handleNotesFilter : undefined}
    >
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;