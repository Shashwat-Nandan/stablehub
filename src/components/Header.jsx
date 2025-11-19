import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.navbar')) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <h1>Laminar Finance</h1>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <Link
                to="/"
                className={location.pathname === '/' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Insights
              </Link>
            </li>
            <li>
              <Link
                to="/compare"
                className={location.pathname === '/compare' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Solutions
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className={location.pathname === '/admin' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Admin
              </Link>
            </li>
            <li>
              <a href="#about" onClick={closeMobileMenu}>About</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}
    </header>
  );
}
