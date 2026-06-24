import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '⚽',
      title: 'Gestion des Équipes',
      desc: 'Ajoutez, modifiez et supprimez des équipes de football facilement.',
      action: () => navigate('/equipes'),
      btnLabel: 'Voir les équipes',
      color: '#0ea5e9',
    },
    {
      icon: '👥',
      title: 'Gestion des Clients',
      desc: 'Gérez votre portefeuille clients avec toutes leurs informations.',
      action: () => navigate('/clients'),
      btnLabel: 'Voir les clients',
      color: '#10b981',
    },
    {
      icon: '📊',
      title: 'Statistiques',
      desc: 'Visualisez les données clés de votre application en un coup d\'œil.',
      action: null,
      btnLabel: 'Bientôt disponible',
      color: '#f59e0b',
    },
  ];

  const stats = [
    { icon: '🌍', label: 'Pays couverts', value: '50+' },
    { icon: '⚡', label: 'Temps de réponse', value: '<100ms' },
    { icon: '🔒', label: 'Disponibilité', value: '99.9%' },
    { icon: '💾', label: 'Données sauvegardées', value: '∞' },
  ];

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero-section" id="hero-section">
        <div className="hero-content">
          <div className="hero-badge">⚽ Football Management</div>
          <h1 className="hero-title">
            Bienvenue sur <span className="gradient-text">FootManager</span>
          </h1>
          <p className="hero-subtitle">
            La plateforme moderne pour gérer vos équipes de football, vos clients et vos données sportives, 
            le tout dans une interface élégante et performante.
          </p>
          <div className="hero-actions">
            <button
              className="btn-hero-primary"
              id="btn-hero-equipes"
              onClick={() => navigate('/equipes')}
            >
              🏆 Gérer les équipes
            </button>
            <button
              className="btn-hero-secondary"
              id="btn-hero-clients"
              onClick={() => navigate('/clients')}
            >
              👥 Voir les clients
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-card-float">
            <span className="hero-float-icon">⚽</span>
            <span className="hero-float-text">FootManager Pro</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats-section" id="home-stats-section">
        <div className="home-stats-grid">
          {stats.map((s, i) => (
            <div className="home-stat-card" key={i} id={`stat-card-${i}`}>
              <span className="home-stat-icon">{s.icon}</span>
              <span className="home-stat-value">{s.value}</span>
              <span className="home-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features-section">
        <div className="section-header">
          <h2 className="section-title">Nos fonctionnalités</h2>
          <p className="section-subtitle">Tout ce dont vous avez besoin pour gérer votre club</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} id={`feature-card-${i}`}>
              <div className="feature-icon-wrap" style={{ background: `${f.color}18`, borderColor: `${f.color}30` }}>
                <span className="feature-icon">{f.icon}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <button
                className={`feature-btn ${f.action ? '' : 'feature-btn-disabled'}`}
                onClick={f.action || undefined}
                disabled={!f.action}
                id={`feature-btn-${i}`}
                style={f.action ? { background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)` } : {}}
              >
                {f.btnLabel} {f.action ? '→' : ''}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Prêt à commencer ?</h2>
          <p className="cta-desc">Gérez vos équipes et clients dès maintenant avec FootManager.</p>
          <button
            className="btn-cta"
            id="btn-cta-start"
            onClick={() => navigate('/equipes')}
          >
            🚀 Démarrer maintenant
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
