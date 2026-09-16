import { Moon, Sun, Menu } from "lucide-react";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <header className="navbar">
      <div className="nav-logo">
        <div className="palm-logo">♨</div>

        <div>
          <h2>PRASHIV</h2>
          <span>HOTEL</span>
        </div>
      </div>

      <nav className="nav-links">
        <a href="#home" className="active">Home</a>
        <a href="#rooms">Rooms</a>
        <a href="#experiences">Experiences</a>
        <a href="#dining">Dining</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="nav-actions">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="book-btn">
          Book Now
        </button>

        <button className="mobile-menu">
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;