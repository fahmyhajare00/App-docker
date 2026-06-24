import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function LoginModal({ onClose }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    // Simulation connexion
    setTimeout(() => {
      setLoading(false);
      setError('Identifiants incorrects. Veuillez réessayer.');
    }, 1200);
  };

  return (
    <div className="login-overlay" id="login-overlay" onClick={onClose}>
      <div className="login-modal" id="login-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="login-close" id="login-close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        {/* Header */}
        <div className="login-header">
          <div className="login-logo">⚽</div>
          <h2 className="login-title">Connexion</h2>
          <p className="login-subtitle">Accédez à votre espace FootManager</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} id="login-form">
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">✉️</span>
              <input
                id="login-email"
                className="login-input"
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label className="login-label" htmlFor="login-password">Mot de passe</label>
              <button type="button" className="login-forgot" id="login-forgot">
                Mot de passe oublié ?
              </button>
            </div>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔒</span>
              <input
                id="login-password"
                className="login-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="login-error" id="login-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className={`login-submit ${loading ? 'login-submit-loading' : ''}`}
            id="login-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner"></span>
            ) : (
              '🔑 Se connecter'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>ou</span>
        </div>

        {/* Register */}
        <p className="login-register">
          Pas encore de compte ?{' '}
          <button type="button" className="login-register-link" id="login-register-link">
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const navLinks = [
    { to: '/', label: 'Accueil', end: true },
    { to: '/equipes', label: 'Équipes', end: false },
    { to: '/clients', label: 'Clients', end: false },
  ];

  return (
    <>
      <header className="app-header" id="app-header">
        <div className="app-header-inner">
          {/* Logo */}
          <div className="app-header-logo">
            <span className="app-header-icon">⚽</span>
            <span className="app-header-title">FootManager</span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="app-nav" id="app-nav" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
                id={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Bouton Connexion */}
          <button
            className="btn-connexion"
            id="btn-connexion"
            aria-label="Se connecter"
            onClick={() => setShowLogin(true)}
          >
            <span className="btn-connexion-icon">🔑</span>
            <span className="btn-connexion-label">Connexion</span>
          </button>

          {/* Burger - Mobile */}
          <button
            className={`nav-burger ${menuOpen ? 'nav-burger-open' : ''}`}
            id="nav-burger"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="app-nav-mobile" id="app-nav-mobile" aria-label="Navigation mobile">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `nav-link-mobile ${isActive ? 'nav-link-mobile-active' : ''}`
                }
                id={`nav-link-mobile-${link.label.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {/* Connexion mobile */}
            <button
              className="btn-connexion-mobile"
              id="btn-connexion-mobile"
              onClick={() => { setShowLogin(true); setMenuOpen(false); }}
            >
              🔑 Connexion
            </button>
          </nav>
        )}
      </header>

      {/* Login Popup */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Header;
