import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="main-header">
      <div className="container header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <h1 className="logo">KIIT Tools</h1>
          </Link>
          <p className="tagline">Essential resources for KIIT students</p>
        </div>

        <div className="header-right">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? (
              <>
                <span role="img" aria-label="light mode" className="theme-icon">☀️</span>
                <span className="theme-text">Light</span>
              </>
            ) : (
              <>
                <span role="img" aria-label="dark mode" className="theme-icon">🌙</span>
                <span className="theme-text">Dark</span>
              </>
            )}
          </button>

          <button 
            className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>      <nav className={`main-nav ${menuOpen ? 'active' : ''}`}>
        <div className="container">          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/calculator" className="nav-link" onClick={() => setMenuOpen(false)}>SGPA/CGPA Calculator</Link>
            </li>
            <li className="nav-item">
              <Link to="/result" className="nav-link" onClick={() => setMenuOpen(false)}>Results</Link>
            </li>
            <li className="nav-item">
              <Link to="/documentation" className="nav-link" onClick={() => setMenuOpen(false)}>Documentation</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
