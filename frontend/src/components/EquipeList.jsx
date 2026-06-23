import EquipeCard from './EquipeCard';

function EquipeList({ equipes, onEdit, onDelete }) {
  if (equipes.length === 0) {
    return (
      <div className="empty-state" id="empty-state">
        <div className="empty-icon">⚽</div>
        <h3>Aucune équipe</h3>
        <p>Commencez par ajouter votre première équipe !</p>
      </div>
    );
  }

  return (
    <div className="equipe-grid" id="equipe-grid">
      {equipes.map((equipe, index) => (
        <EquipeCard
          key={equipe.id}
          equipe={equipe}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default EquipeList;
