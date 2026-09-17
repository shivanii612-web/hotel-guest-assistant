import { Moon, Sun, Menu } from "lucide-react";

function Navbar({ darkMode, setDarkMode }) {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
        <a href="#home" className="active" onClick={scrollTo("home")}>Home</a>
        <a href="#rooms" onClick={scrollTo("rooms")}>Rooms</a>
        <a href="#experiences" onClick={scrollTo("experiences")}>Experiences</a>
        <a href="#dining" onClick={scrollTo("dining")}>Dining</a>
        <a href="#gallery" onClick={scrollTo("gallery")}>Gallery</a>
        <a href="#contact" onClick={scrollTo("contact")}>Contact</a>
      </nav>

      <div className="nav-actions">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="book-btn"
          onClick={() => {
            const roomsSection = document.getElementById("rooms");
            if (roomsSection) {
              roomsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            window.dispatchEvent(
              new CustomEvent("prashiv-open-booking", {
                detail: { roomId: "deluxe" },
              })
            );
          }}
        >
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