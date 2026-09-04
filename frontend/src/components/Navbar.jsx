import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Report Issue', to: '/report' },
  { label: 'Community Reports', to: '/reports' },
  { label: 'About', to: '/about' }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container navbar-content">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="CleanSL home">
          <span className="brand-mark"><Leaf size={19} strokeWidth={2.5} /></span>
          <span>CleanSL</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav id="primary-navigation" className={`primary-navigation ${isMenuOpen ? 'is-open' : ''}`}>
          <div className="nav-links">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <Link className="button button-primary nav-cta" to="/report" onClick={closeMenu}>
            <Leaf size={17} />
            Report Waste
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
