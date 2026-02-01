import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar-floating">
      <div className="navbar-floating-content">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-floating-logo">
          <img src="/IRTILOGO.png" alt="ITRI AI Logo" width="150" />
        </Link>

        {/* Navigation Links */}
        <div className="navbar-floating-links">
          <Link to="/" className="navbar-floating-link">
            Home
          </Link>
          <Link to="/speakers" className="navbar-floating-link">
            Speakers
          </Link>
          <Link to="/program" className="navbar-floating-link">
            Program
          </Link>
          <Link to="/reservation" className="navbar-floating-reserve">
            Reserve Your Seat
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="navbar-floating-menu">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
