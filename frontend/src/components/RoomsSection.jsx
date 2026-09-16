const rooms = [
  {
    name: "Standard Room",
    image: "/images/standard-room.jpg",
    description: "Cozy and elegant room with modern amenities for a comfortable stay.",
    guests: "2 Guests",
    bed: "King Bed",
    price: "₹6,500",
  },
  {
    name: "Deluxe Room",
    image: "/images/deluxe-room.jpg",
    description: "Spacious room with garden or pool view, featuring premium amenities.",
    guests: "3 Guests",
    bed: "King Bed",
    price: "₹8,500",
  },
  {
    name: "Family Suite",
    image: "/images/family-suite.jpg",
    description: "Perfect for families with extra space and comfortable facilities.",
    guests: "4 Guests",
    bed: "2 Queen Beds",
    price: "₹12,000",
  },
];

function RoomsSection() {
  return (
    <section className="section rooms-section" id="rooms">
      <div className="section-heading">
        <div>
          <div className="section-label">STAY IN COMFORT</div>
          <h2>Rooms & Suites</h2>
          <p>Comfortable stays for every kind of traveler.</p>
        </div>

        <button className="text-btn">
          View All Rooms →
        </button>
      </div>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room.name}>
            <div className="room-image">
              <img src={room.image} alt={room.name} />
            </div>

            <div className="room-content">
              <h3>{room.name}</h3>

              <p>{room.description}</p>

              <div className="room-details">
                <span>♙ {room.guests}</span>
                <span>▣ {room.bed}</span>
              </div>

              <div className="room-bottom">
                <div>
                  <strong>{room.price}</strong>
                  <small> / night</small>
                </div>

                <button className="small-btn">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RoomsSection;