import { useState, useEffect } from 'react';

const COUNTRIES = [
  'Maroc',
  'France',
  'Espagne',
  'Italie',
  'Angleterre',
  'Allemagne',
  'Portugal',
  'Pays-Bas',
  'Brésil',
  'Argentine',
  'Turquie',
];

function EquipeForm({ equipe, onSubmit, onClose }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('France');

  const isEditing = Boolean(equipe);

  useEffect(() => {
    if (equipe) {
      setName(equipe.name);
      setCountry(equipe.country);
    } else {
      setName('');
      setCountry('Maroc');
    }
  }, [equipe]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), country });
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()} id="equipe-form-modal">
        <button className="btn-close-modal" onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        <h2>{isEditing ? '✏️ Modifier l\'équipe' : '➕ Nouvelle équipe'}</h2>
        <p className="modal-subtitle">
          {isEditing
            ? `Modification de ${equipe.name}`
            : 'Ajoutez une nouvelle équipe à la liste'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="equipe-name">Nom de l'équipe</label>
            <input
              id="equipe-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Manchester United"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="equipe-country">Pays</label>
            <select
              id="equipe-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-submit" id="btn-submit-equipe">
              {isEditing ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EquipeForm;
