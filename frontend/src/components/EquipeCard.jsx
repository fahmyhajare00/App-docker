const FLAG_MAP = {
  'Maroc': '🇲🇦',
  'France': '🇫🇷',
  'Espagne': '🇪🇸',
  'Italie': '🇮🇹',
  'Angleterre': '🇬🇧',
  'Allemagne': '🇩🇪',
  'Portugal': '🇵🇹',
  'Pays-Bas': '🇳🇱',
  'Brésil': '🇧🇷',
  'Argentine': '🇦🇷',
  'Turquie': '🇹🇷',
};

function EquipeCard({ equipe, onEdit, onDelete, index = 0 }) {
  const flag = FLAG_MAP[equipe.country] || '🏳️';
  const delay = `${index * 0.07}s`;

  return (
    <div
      className="equipe-card"
      id={`equipe-card-${equipe.id}`}
      style={{ animationDelay: delay }}
    >
      <div className="card-top">
        <span className="card-flag" role="img" aria-label={equipe.country}>
          {flag}
        </span>
        <span className="card-id">#{equipe.id}</span>
      </div>

      <h3 className="card-name">{equipe.name}</h3>
      
      <div className="card-country">
        <span className="card-country-icon">📍</span>
        {equipe.country}
      </div>

      <div className="card-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(equipe)}
          id={`btn-edit-${equipe.id}`}
          aria-label={`Modifier ${equipe.name}`}
        >
           Modifier
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(equipe)}
          id={`btn-delete-${equipe.id}`}
          aria-label={`Supprimer ${equipe.name}`}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default EquipeCard;
