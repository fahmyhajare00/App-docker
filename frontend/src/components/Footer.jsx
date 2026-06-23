function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer" id="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-left">
          <span className="app-footer-logo">⚽ FootManager</span>
          <p className="app-footer-desc">Gestion des équipes de football</p>
        </div>
        <div className="app-footer-right">
          <p className="app-footer-copy">© {year} FootManager. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
