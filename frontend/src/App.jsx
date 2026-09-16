import { useState } from "react";
import "./App.css";

const rooms = [
  {
    name: "Standard Room",
    price: "₹6,500",
    guests: "2 Guests",
    bed: "King Bed",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=85",
    description:
      "Cozy and elegant room with modern amenities for a comfortable stay.",
  },
  {
    name: "Deluxe Room",
    price: "₹8,500",
    guests: "3 Guests",
    bed: "King Bed",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85",
    description:
      "Spacious room with premium interiors and beautiful pool views.",
  },
  {
    name: "Family Suite",
    price: "₹12,000",
    guests: "4 Guests",
    bed: "2 Queen Beds",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85",
    description:
      "A spacious suite designed for families with extra comfort.",
  },
];

const experiences = [
  {
    title: "Infinity Pool",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Fine Dining",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Spa & Wellness",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Beach Experience",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=85",
];

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! 👋 I'm your Hotel Concierge. How can I help with your stay?",
    },
  ]);

  const quickQuestions = [
    "Check-in & Check-out",
    "Show me rooms",
    "Is breakfast included?",
    "What amenities do you have?",
  ];

  const sendMessage = (text = message) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: text,
      },
    ]);

    setMessage("");

    setTimeout(() => {
      let reply =
        "I'd be happy to help. You can ask me about rooms, check-in, breakfast, amenities, policies, or availability.";

      const lower = text.toLowerCase();

      if (lower.includes("check")) {
        reply =
          "Check-in starts at 2:00 PM and check-out is at 11:00 AM.";
      } else if (lower.includes("breakfast")) {
        reply =
          "Yes! Breakfast is included for hotel guests. It is served from 6:30 AM to 10:30 AM.";
      } else if (lower.includes("room")) {
        reply =
          "We have Standard, Deluxe and Family Suite rooms. I can also help you find a room based on your number of guests.";
      } else if (
        lower.includes("amenit") ||
        lower.includes("pool") ||
        lower.includes("gym")
      ) {
        reply =
          "Our amenities include a swimming pool, fitness center, spa & wellness, restaurant, free Wi-Fi and secure parking.";
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: reply,
        },
      ]);
    }, 700);
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="logo">
          <div className="logo-mark">✦</div>
          <div>
            <div className="logo-name">PRASHIV</div>
            <div className="logo-sub">HOTEL</div>
          </div>
        </div>

        <nav>
          <a className="active" href="#home">
            Home
          </a>
          <a href="#rooms">Rooms</a>
          <a href="#experiences">Experiences</a>
          <a href="#dining">Dining</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <button className="book-btn">Book Now</button>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section className="hero" id="home">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-copy">
              <span className="eyebrow">WELCOME TO PRASHIV</span>

              <h1>
                Luxury.
                <br />
                Comfort.
                <br />
                Hospitality.
              </h1>

              <p>
                Experience a relaxing stay with beautiful rooms, exceptional
                dining and thoughtful guest services.
              </p>

              <div className="hero-buttons">
                <button className="primary-btn">Explore Rooms →</button>

                <button
                  className="secondary-btn"
                  onClick={() => setChatOpen(true)}
                >
                  ✦ Ask Concierge
                </button>
              </div>

              <div className="hero-features">
                <span>✦ Premium Stay</span>
                <span>✦ Guest Concierge</span>
                <span>✦ 24/7 Assistance</span>
              </div>
            </div>

            {/* ================= AI CHAT ================= */}
            <div className={`hero-chat ${chatOpen ? "chat-visible" : ""}`}>
              <div className="chat-header">
                <div className="chat-brand">
                  <div className="ai-icon">✦</div>

                  <div>
                    <strong>Hotel Concierge</strong>
                    <small>AI assistant · Ready to help</small>
                  </div>
                </div>

                <button
                  className="chat-close"
                  onClick={() => setChatOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="quick-actions">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="chat-messages">
                {messages.map((item, index) => (
                  <div
                    className={`message-row ${
                      item.type === "user" ? "user-row" : ""
                    }`}
                    key={index}
                  >
                    {item.type === "bot" && (
                      <div className="message-avatar">✦</div>
                    )}

                    <div
                      className={`message ${
                        item.type === "user" ? "user-message" : "bot-message"
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-area">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="Ask anything about your stay..."
                />

                <button onClick={() => sendMessage()}>➤</button>
              </div>
            </div>

            {!chatOpen && (
              <button
                className="floating-concierge"
                onClick={() => setChatOpen(true)}
              >
                <span>✦</span>
                Hotel Concierge
              </button>
            )}
          </div>
        </section>

        {/* ================= HIGHLIGHTS ================= */}
        <section className="highlights">
          <div>
            <span>♧</span>
            <strong>Luxury Rooms</strong>
            <small>Designed for comfort</small>
          </div>

          <div>
            <span>♨</span>
            <strong>Fine Dining</strong>
            <small>Exceptional cuisine</small>
          </div>

          <div>
            <span>≋</span>
            <strong>Swimming Pool</strong>
            <small>Relax & unwind</small>
          </div>

          <div>
            <span>✿</span>
            <strong>Wellness & Spa</strong>
            <small>Refresh your senses</small>
          </div>

          <div>
            <span>⌁</span>
            <strong>Free Wi-Fi</strong>
            <small>Stay connected</small>
          </div>

          <div>
            <span>▣</span>
            <strong>Secure Parking</strong>
            <small>For hotel guests</small>
          </div>
        </section>

        {/* ================= ROOMS ================= */}
        <section className="section" id="rooms">
          <div className="section-heading">
            <div>
              <span className="eyebrow">STAY IN COMFORT</span>
              <h2>Rooms & Suites</h2>
              <p>Comfortable stays designed for every kind of traveler.</p>
            </div>

            <button className="text-btn">View All Rooms →</button>
          </div>

          <div className="rooms-grid">
            {rooms.map((room) => (
              <div className="room-card" key={room.name}>
                <div className="room-image">
                  <img src={room.image} alt={room.name} />
                  <span className="room-tag">PRASHIV</span>
                </div>

                <div className="room-info">
                  <h3>{room.name}</h3>

                  <p>{room.description}</p>

                  <div className="room-meta">
                    <span>♙ {room.guests}</span>
                    <span>▣ {room.bed}</span>
                  </div>

                  <div className="room-bottom">
                    <div>
                      <strong>{room.price}</strong>
                      <small>/ night</small>
                    </div>

                    <button>View Details →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= EXPERIENCES ================= */}
        <section className="section experiences-section" id="experiences">
          <div className="center-heading">
            <span className="eyebrow">EXPERIENCES TO INSPIRE</span>
            <h2>Make Your Stay Memorable</h2>
            <p>
              Discover experiences designed to make every moment special.
            </p>
          </div>

          <div className="experience-grid">
            {experiences.map((experience) => (
              <div className="experience-card" key={experience.title}>
                <img src={experience.image} alt={experience.title} />
                <div className="experience-overlay">
                  <h3>{experience.title}</h3>
                  <span>Explore Experience →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= DINING ================= */}
        <section className="dining-section" id="dining">
          <div className="dining-image">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85"
              alt="PRASHIV dining"
            />
          </div>

          <div className="dining-content">
            <span className="eyebrow">TASTE THE EXPERIENCE</span>

            <h2>Fine Dining at PRASHIV</h2>

            <p>
              Savor exquisite flavors at our signature restaurant, where every
              meal becomes part of your stay.
            </p>

            <div className="dining-times">
              <div>
                <span>☕</span>
                <small>Breakfast</small>
                <strong>6:30 AM – 10:30 AM</strong>
              </div>

              <div>
                <span>◉</span>
                <small>Lunch</small>
                <strong>12:30 PM – 3:00 PM</strong>
              </div>

              <div>
                <span>◌</span>
                <small>Dinner</small>
                <strong>7:00 PM – 11:00 PM</strong>
              </div>
            </div>

            <button className="primary-btn">Explore Dining →</button>
          </div>
        </section>

        {/* ================= GALLERY ================= */}
        <section className="section" id="gallery">
          <div className="center-heading">
            <span className="eyebrow">A GLIMPSE OF PRASHIV</span>
            <h2>Our Gallery</h2>
            <p>A look at the spaces and experiences waiting for you.</p>
          </div>

          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <div className="gallery-item" key={image}>
                <img src={image} alt={`PRASHIV gallery ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="cta-section">
          <span className="eyebrow">PLAN YOUR PERFECT GETAWAY</span>

          <h2>Ready for your stay?</h2>

          <p>Find the perfect room for your next getaway.</p>

          <button className="primary-btn">Check Availability →</button>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer id="contact">
        <div className="footer-main">
          <div className="footer-brand">
            <h3>PRASHIV</h3>
            <span>HOTEL</span>

            <p>
              Luxury, comfort and thoughtful hospitality for every memorable
              stay.
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
            <a href="#contact">Contact</a>
          </div>

          <div>
            <h4>Contact</h4>
            <span>PRASHIV</span>
            <span>Key West, Florida</span>
            <span>+1 234 567 890</span>
            <span>hello@prashiv.com</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 PRASHIV</span>
          <span>Privacy Policy · Terms</span>
        </div>
      </footer>
    </div>
  );
}

export default App;