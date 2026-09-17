const Hero = ({ onAskConcierge }) => {
  const scrollToRooms = () => {
    document.getElementById("rooms")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openConcierge = () => {
    if (onAskConcierge) {
      onAskConcierge();
    } else {
      const btn = document.querySelector(".floating-concierge") || document.querySelector(".chat-button");
      if (btn) btn.click();
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=90"
          alt="Aurelia Grand Hotel"
        />
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="hero-eyebrow">WELCOME TO AURELIA GRAND</p>

        <h1>
          Your stay.
          <br />
          <span>Made effortless.</span>
        </h1>

        <p className="hero-description">
          Experience refined comfort, exceptional dining, and a
          smarter way to enjoy your stay with our AI-powered
          Hotel Concierge.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={scrollToRooms}>
            Explore Rooms →
          </button>

          <button className="secondary-btn" onClick={openConcierge}>
            ✦ Ask AI Concierge
          </button>
        </div>

        <div className="hero-features">
          <span>✦ Luxury Stay</span>
          <span>✦ AI Concierge</span>
          <span>✦ 24/7 Guest Assistance</span>
        </div>
      </div>

      <div className="hero-hotel-name">
        <span>AURELIA</span>
        <small>GRAND HOTEL</small>
      </div>
    </section>
  );
};

export default Hero;