import { Users, BedDouble } from "lucide-react";

const rooms = [
  {
    name: "Standard Room",
    description:
      "Cozy and elegant room with modern amenities for a comfortable stay.",
    guests: "2 Guests",
    bed: "King Bed",
    price: "₹6,500",
    image: "/images/standard-room.jpg",
  },
  {
    name: "Deluxe Room",
    description:
      "Spacious room with garden or pool view, featuring premium amenities.",
    guests: "3 Guests",
    bed: "King Bed",
    price: "₹8,500",
    image: "/images/deluxe-room.jpg",
  },
  {
    name: "Family Suite",
    description:
      "Perfect for families with extra space and comfortable surroundings.",
    guests: "4 Guests",
    bed: "2 Queen Beds",
    price: "₹12,000",
    image: "/images/family-suite.jpg",
  },
];

function RoomsSection() {
  return (
    <section className="section rooms-section" id="rooms">
      <div className="section-heading">
        <div>
          <p className="section-label">STAY WITH US</p>
          <h2>Rooms & Suites</h2>
          <p>
            Comfortable stays for every kind of traveler.
          </p>
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
                <span>
                  <Users size={15} />
                  {room.guests}
                </span>

                <span>
                  <BedDouble size={15} />
                  {room.bed}
                </span>
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