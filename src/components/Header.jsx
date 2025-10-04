import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <h1>StablecoinHub</h1>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/compare" className={location.pathname === '/compare' ? 'active' : ''}>
                Compare Stablecoins
              </Link>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
