import { useState, useEffect, useCallback } from 'react';
import './App.css';
import EquipeList from './components/EquipeList';
import EquipeForm from './components/EquipeForm';
import Header from './components/Header';
import Footer from './components/Footer';
const API_URL = '/api/equipes';

function App() {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipe, setEditingEquipe] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);


  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


  const fetchEquipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setEquipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipes();
  }, [fetchEquipes]);

  const handleAdd = async (formData) => {
    try {
      const newId = String(
        equipes.length > 0
          ? Math.max(...equipes.map((e) => parseInt(e.id))) + 1
          : 1
      );

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newId, ...formData }),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'ajout');

      const result = await res.json();
      setEquipes(result.data);
      setShowForm(false);
      showToast(`${formData.name} ajoutée avec succès ! ⚽`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Update equipe
  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/${editingEquipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erreur lors de la modification');

      const result = await res.json();
      setEquipes(result.data);
      setEditingEquipe(null);
      showToast(`${formData.name} modifiée avec succès ! `);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delete equipe
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      const result = await res.json();
      setEquipes(result.data);
      setDeleteTarget(null);
      showToast(`${deleteTarget.name} supprimée`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Count unique countries
  const uniqueCountries = [...new Set(equipes.map((e) => e.country))].length;

  return (
    <div className="page-wrapper" id="page-wrapper">
      <Header />
      <div className="app" id="app-container">
      {/* Titre section */}
      <header className="header" id="app-header">
        <h1>Gestion des Équipes</h1>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{equipes.length}</span>
            <span className="stat-label">Équipes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{uniqueCountries}</span>
            <span className="stat-label">Pays</span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="toolbar" id="toolbar">
        <h2>Liste des équipes</h2>
        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
          id="btn-add-equipe"
        >
          <span>➕</span> Ajouter une équipe
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading" id="loading-state">
          <div className="spinner"></div>
          <p>Chargement des équipes...</p>
        </div>
      ) : error ? (
        <div className="error-state" id="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de connexion</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchEquipes} id="btn-retry">
            🔄 Réessayer
          </button>
        </div>
      ) : (
        <EquipeList
          equipes={equipes}
          onEdit={(equipe) => setEditingEquipe(equipe)}
          onDelete={(equipe) => setDeleteTarget(equipe)}
        />
      )}

      {/* Add Form Modal */}
      {showForm && (
        <EquipeForm
          equipe={null}
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Form Modal */}
      {editingEquipe && (
        <EquipeForm
          equipe={editingEquipe}
          onSubmit={handleUpdate}
          onClose={() => setEditingEquipe(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)} id="delete-modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close-modal"
              onClick={() => setDeleteTarget(null)}
              aria-label="Fermer"
            >
              ✕
            </button>
            <h2>Confirmer la suppression</h2>
            <p className="modal-subtitle">Cette action est irréversible</p>
            <p className="confirm-text">
              Voulez-vous vraiment supprimer l'équipe{' '}
              <span className="confirm-name">{deleteTarget.name}</span> ?
            </p>
            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Annuler
              </button>
              <button
                className="btn-confirm-delete"
                onClick={handleDelete}
                id="btn-confirm-delete"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <div
          className={`toast toast-${toast.type}`}
          id="toast-notification"
          role="alert"
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
