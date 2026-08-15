import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  FiZap,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiArrowRight,
  FiUser,
  FiLogOut,
  FiGrid,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Overview', href: '#' },
  { name: 'Workspaces', href: '#portals' },
];


const LandingNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
      return;
    }

    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className={`landing-nav-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="landing-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="landing-nav-logo">
          <div className="landing-logo-badge">
            <FiZap size={18} className="landing-logo-icon" />
          </div>
          <span className="landing-logo-text">
            Support<span className="landing-logo-accent">X</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="landing-nav-links" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="landing-nav-link"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="landing-nav-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="landing-theme-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          {user ? (
            <div className="landing-user-nav">
              <Link to={user.role === 'admin' ? '/dashboard' : '/tickets'} className="btn btn-primary btn-sm">
                <FiGrid size={15} /> Dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="btn btn-secondary btn-sm"
                title="Log Out"
              >
                <FiLogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="landing-auth-btns">
              <Link to="/login" className="landing-nav-btn-ghost">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary landing-nav-btn-cta">
                <span>Get Started</span>
                <FiArrowRight size={15} />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="landing-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="landing-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="landing-mobile-inner">
              <div className="landing-mobile-links">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="landing-mobile-link"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="landing-mobile-divider" />
              {user ? (
                <div className="landing-mobile-auth">
                  <div className="landing-mobile-user-info">
                    <FiUser size={16} />
                    <span>Signed in as <strong>{user.name}</strong> ({user.role})</span>
                  </div>
                  <Link
                    to={user.role === 'admin' ? '/dashboard' : '/tickets'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary btn-block"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-secondary btn-block"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="landing-mobile-auth">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary btn-block"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary btn-block"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingNavbar;
