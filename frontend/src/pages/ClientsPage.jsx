import { useState } from 'react';

const INITIAL_CLIENTS = [
  { id: 1, name: 'Ahmed Khalil', email: 'ahmed@example.com', phone: '+212 6 12 34 56 78', city: 'Casablanca', status: 'actif', equipe: 'Raja CA' },
  { id: 2, name: 'Sofia Benali', email: 'sofia@example.com', phone: '+212 6 98 76 54 32', city: 'Rabat', status: 'actif', equipe: 'WAC' },
  { id: 3, name: 'Karim Mansouri', email: 'karim@example.com', phone: '+213 5 55 44 33 22', city: 'Alger', status: 'inactif', equipe: 'MC Alger' },
  { id: 4, name: 'Nadia Tazi', email: 'nadia@example.com', phone: '+212 6 44 55 66 77', city: 'Fès', status: 'actif', equipe: 'MAS' },
];

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(
    client || { name: '', email: '', phone: '', city: '', status: 'actif', equipe: '' }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="client-modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose} aria-label="Fermer">✕</button>
        <h2>{client ? 'Modifier le client' : 'Nouveau client'}</h2>
        <p className="modal-subtitle">{client ? 'Mettez à jour les informations' : 'Remplissez le formulaire ci-dessous'}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ex: Jean Dupont" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Ex: jean@email.com" required />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Ex: +212 6 12 34 56 78" />
          </div>
          <div className="form-group">
            <label>Ville</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="Ex: Casablanca" />
          </div>
          <div className="form-group">
            <label>Équipe favorite</label>
            <input name="equipe" value={form.equipe} onChange={handleChange} placeholder="Ex: Raja CA" />
          </div>
          <div className="form-group">
            <label>Statut</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-submit" id="btn-client-submit">
              {client ? '✏️ Modifier' : '➕ Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientsPage() {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'tous' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = (form) => {
    if (editingClient) {
      setClients(clients.map((c) => (c.id === editingClient.id ? { ...c, ...form } : c)));
      showToast(`${form.name} modifié avec succès !`);
      setEditingClient(null);
    } else {
      const newClient = { ...form, id: Date.now() };
      setClients([...clients, newClient]);
      showToast(`${form.name} ajouté avec succès !`);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setClients(clients.filter((c) => c.id !== deleteTarget.id));
    showToast(`${deleteTarget.name} supprimé`, 'error');
    setDeleteTarget(null);
  };

  const activeCount = clients.filter((c) => c.status === 'actif').length;
  const inactiveCount = clients.filter((c) => c.status === 'inactif').length;

  return (
    <div className="app" id="clients-page">
      {/* Header */}
      <header className="header" id="clients-header">
        <h1>👥 Gestion des Clients</h1>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{clients.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ background: 'linear-gradient(135deg,#10b981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{activeCount}</span>
            <span className="stat-label">Actifs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ background: 'linear-gradient(135deg,#f87171,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{inactiveCount}</span>
            <span className="stat-label">Inactifs</span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="clients-toolbar" id="clients-toolbar">
        <div className="clients-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="clients-search"
            id="clients-search-input"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="clients-filters">
          {['tous', 'actif', 'inactif'].map((s) => (
            <button
              key={s}
              className={`filter-btn ${filterStatus === s ? 'filter-btn-active' : ''}`}
              onClick={() => setFilterStatus(s)}
              id={`filter-btn-${s}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button
          className="btn-add"
          id="btn-add-client"
          onClick={() => { setEditingClient(null); setShowModal(true); }}
        >
          <span>➕</span> Ajouter un client
        </button>
      </div>

      {/* Clients Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Aucun client trouvé</h3>
          <p>Essayez de modifier vos critères de recherche ou ajoutez un nouveau client.</p>
        </div>
      ) : (
        <div className="clients-table-wrap" id="clients-table">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Contact</th>
                <th>Ville</th>
                <th>Équipe</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} id={`client-row-${client.id}`}>
                  <td>
                    <div className="client-name-cell">
                      <div className="client-avatar">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="client-name">{client.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="client-contact">
                      <span className="client-email">✉️ {client.email}</span>
                      <span className="client-phone">📞 {client.phone}</span>
                    </div>
                  </td>
                  <td><span className="client-city">📍 {client.city}</span></td>
                  <td><span className="client-equipe">⚽ {client.equipe || '—'}</span></td>
                  <td>
                    <span className={`status-badge status-${client.status}`}>
                      {client.status === 'actif' ? '✅ Actif' : '⛔ Inactif'}
                    </span>
                  </td>
                  <td>
                    <div className="card-actions" style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
                      <button
                        className="btn-edit"
                        id={`btn-edit-client-${client.id}`}
                        onClick={() => { setEditingClient(client); setShowModal(true); }}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        className="btn-delete"
                        id={`btn-delete-client-${client.id}`}
                        onClick={() => setDeleteTarget(client)}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <ClientModal
          client={editingClient}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingClient(null); }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)} id="client-delete-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setDeleteTarget(null)}>✕</button>
            <h2>Confirmer la suppression</h2>
            <p className="modal-subtitle">Cette action est irréversible</p>
            <p className="confirm-text">
              Voulez-vous vraiment supprimer le client{' '}
              <span className="confirm-name">{deleteTarget.name}</span> ?
            </p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button className="btn-confirm-delete" onClick={handleDelete} id="btn-confirm-delete-client">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`} id="client-toast" role="alert">
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}

export default ClientsPage;
