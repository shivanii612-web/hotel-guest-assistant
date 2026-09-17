function BookingCTA() {
  const handleScrollToRooms = () => {
    document.getElementById("rooms")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="booking-cta">
      <div className="booking-overlay"></div>

      <div className="booking-content">
        <p className="section-label">PLAN YOUR PERFECT GETAWAY</p>

        <h2>Ready for your stay?</h2>

        <p>Find the perfect room for your next getaway.</p>

        <button className="primary-btn" onClick={handleScrollToRooms}>
          Check Availability →
        </button>
      </div>
    </section>
  );
}

export default BookingCTA;