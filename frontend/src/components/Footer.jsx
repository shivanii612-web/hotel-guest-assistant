function Footer() {
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
          <a href="#rooms">Rooms</a>
          <a href="#experiences">Experiences</a>
          <a href="#dining">Dining</a>
          <a href="#gallery">Gallery</a>
        </div>

        <div>
          <h4>Hotel</h4>
          <a href="#home">About Us</a>
          <a href="#home">Amenities</a>
          <a href="#home">Policies</a>
          <a href="#home">Contact</a>
        </div>

        <div>
          <h4>Contact</h4>
          <p>PRASHIV</p>
          <p>Key West, Florida</p>
          <p>+1 234 567 890</p>
          <p>hello@prashiv.com</p>
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