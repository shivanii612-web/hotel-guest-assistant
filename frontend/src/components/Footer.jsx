function Footer() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-main">

        <div className="footer-brand">
          <h2>PRASHIV</h2>
          <span>HOTEL</span>

          <p>
            Luxury, comfort and thoughtful hospitality
            for every memorable stay.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <a href="#rooms" onClick={scrollTo("rooms")}>Rooms</a>
          <a href="#experiences" onClick={scrollTo("experiences")}>Experiences</a>
          <a href="#dining" onClick={scrollTo("dining")}>Dining</a>
          <a href="#gallery" onClick={scrollTo("gallery")}>Gallery</a>
        </div>

        <div>
          <h4>Hotel</h4>
          <a href="#home" onClick={scrollTo("home")}>About Us</a>
          <a href="#amenities" onClick={scrollTo("amenities")}>Amenities</a>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              const floating = document.querySelector(".floating-concierge");
              if (floating) floating.click();
              document.querySelector(".hero-chat")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            Policies
          </a>
          <a href="#contact" onClick={scrollTo("contact")}>Contact</a>
        </div>

        <div>
          <h4>Contact</h4>
          <p>PRASHIV</p>
          <p>Key West, Florida</p>
          <p><a href="tel:+1234567890" style={{ color: "inherit", textDecoration: "none" }}>+1 234 567 890</a></p>
          <p><a href="mailto:hello@prashiv.com" style={{ color: "inherit", textDecoration: "none" }}>hello@prashiv.com</a></p>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2026 PRASHIV</span>
        <span>Privacy Policy · Terms</span>
      </div>
    </footer>
  );
}

export default Footer;