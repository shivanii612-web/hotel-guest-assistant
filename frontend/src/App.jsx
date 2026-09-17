import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Menu, X } from "lucide-react";
import "./App.css";
import RoomsSection from "./components/RoomsSection";
import Experiences from "./components/Experiences";
import DiningModal from "./components/DiningModal";
import { sendChatMessage } from "./services/api";

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
  const [activeNav, setActiveNav] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isDiningModalOpen, setIsDiningModalOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  const handleOpenConcierge = () => {
    setChatOpen(true);
    setTimeout(() => {
      document.querySelector(".hero-chat")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  const scrollToSection = (id) => (e) => {
    if (e) e.preventDefault();
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const sectionIds = ["home", "rooms", "experiences", "dining", "gallery", "contact"];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop - 150;
          if (scrollY >= top) {
            setActiveNav(sectionIds[i]);
            break;
          }
        }
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 850) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  const sendMessage = async (text = message) => {
    if (chatLoading) return;
    const userText = (typeof text === "string" ? text : message).trim();
    if (!userText) return;

    const currentMessages = [
      ...messages,
      {
        type: "user",
        text: userText,
      },
    ];

    setMessages(currentMessages);
    setMessage("");

    try {
      setChatLoading(true);
      const conversationHistory = currentMessages
        .filter((msg) => msg.type === "user" || msg.type === "bot")
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      const data = await sendChatMessage({
        message: userText,
        conversation: conversationHistory.slice(0, -1),
      });

      if (data && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: data.answer,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "I'd be happy to help. You can ask me about rooms, check-in, breakfast, amenities, policies, or availability.",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to get chat response:", err);
      toast.error("Unable to get a response right now. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <Toaster position="top-right" />
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
          <a
            className={activeNav === "home" ? "active" : ""}
            href="#home"
            onClick={scrollToSection("home")}
          >
            Home
          </a>
          <a
            className={activeNav === "rooms" ? "active" : ""}
            href="#rooms"
            onClick={scrollToSection("rooms")}
          >
            Rooms
          </a>
          <a
            className={activeNav === "experiences" ? "active" : ""}
            href="#experiences"
            onClick={scrollToSection("experiences")}
          >
            Experiences
          </a>
          <a
            className={activeNav === "dining" ? "active" : ""}
            href="#dining"
            onClick={scrollToSection("dining")}
          >
            Dining
          </a>
          <a
            className={activeNav === "gallery" ? "active" : ""}
            href="#gallery"
            onClick={scrollToSection("gallery")}
          >
            Gallery
          </a>
          <a
            className={activeNav === "contact" ? "active" : ""}
            href="#contact"
            onClick={scrollToSection("contact")}
          >
            Contact
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark or light theme"
          >
            {darkMode ? "☀" : "☾"}
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

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <a
          className={activeNav === "home" ? "active" : ""}
          href="#home"
          onClick={(e) => {
            scrollToSection("home")(e);
            setMobileMenuOpen(false);
          }}
        >
          Home
        </a>
        <a
          className={activeNav === "rooms" ? "active" : ""}
          href="#rooms"
          onClick={(e) => {
            scrollToSection("rooms")(e);
            setMobileMenuOpen(false);
          }}
        >
          Rooms
        </a>
        <a
          className={activeNav === "experiences" ? "active" : ""}
          href="#experiences"
          onClick={(e) => {
            scrollToSection("experiences")(e);
            setMobileMenuOpen(false);
          }}
        >
          Experiences
        </a>
        <a
          className={activeNav === "dining" ? "active" : ""}
          href="#dining"
          onClick={(e) => {
            scrollToSection("dining")(e);
            setMobileMenuOpen(false);
          }}
        >
          Dining
        </a>
        <a
          className={activeNav === "gallery" ? "active" : ""}
          href="#gallery"
          onClick={(e) => {
            scrollToSection("gallery")(e);
            setMobileMenuOpen(false);
          }}
        >
          Gallery
        </a>
        <a
          className={activeNav === "contact" ? "active" : ""}
          href="#contact"
          onClick={(e) => {
            scrollToSection("contact")(e);
            setMobileMenuOpen(false);
          }}
        >
          Contact
        </a>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

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
                <button
                  className="primary-btn"
                  onClick={() => {
                    document.getElementById("rooms")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  Explore Rooms →
                </button>

                <button
                  className="secondary-btn"
                  onClick={handleOpenConcierge}
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
            <div
              className={`hero-chat ${chatOpen ? "chat-visible" : ""}`}
              style={{ display: chatOpen ? "flex" : "none" }}
            >
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
                    disabled={chatLoading}
                    onClick={() => sendMessage(question)}
                    style={{
                      cursor: chatLoading ? "not-allowed" : "pointer",
                      opacity: chatLoading ? 0.6 : 1,
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="chat-messages" ref={chatMessagesRef}>
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

                {chatLoading && (
                  <div className="message-row">
                    <div className="message-avatar">✦</div>
                    <div
                      className="message bot-message"
                      style={{
                        fontStyle: "italic",
                        opacity: 0.85,
                      }}
                    >
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input-area">
                <input
                  value={message}
                  disabled={chatLoading}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !chatLoading) sendMessage();
                  }}
                  placeholder={chatLoading ? "Thinking..." : "Ask anything about your stay..."}
                />

                <button
                  disabled={chatLoading}
                  onClick={() => sendMessage()}
                  style={{
                    opacity: chatLoading ? 0.6 : 1,
                    cursor: chatLoading ? "not-allowed" : "pointer",
                  }}
                >
                  ➤
                </button>
              </div>
            </div>

            {!chatOpen && (
              <button
                className="floating-concierge"
                onClick={handleOpenConcierge}
              >
                <span>✦</span>
                Hotel Concierge
              </button>
            )}
          </div>
        </section>

        {/* ================= HIGHLIGHTS ================= */}
        <section className="highlights" id="amenities">
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
        <RoomsSection />

        {/* ================= EXPERIENCES ================= */}
        <Experiences />

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

            <button
              className="primary-btn"
              onClick={() => setIsDiningModalOpen(true)}
            >
              Explore Dining →
            </button>
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

          <button
            className="primary-btn"
            onClick={() => {
              document.getElementById("rooms")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Check Availability →
          </button>
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
            <a href="#rooms" onClick={scrollToSection("rooms")}>Rooms</a>
            <a href="#experiences" onClick={scrollToSection("experiences")}>Experiences</a>
            <a href="#dining" onClick={scrollToSection("dining")}>Dining</a>
            <a href="#gallery" onClick={scrollToSection("gallery")}>Gallery</a>
          </div>

          <div>
            <h4>Hotel</h4>
            <a href="#home" onClick={scrollToSection("home")}>About Us</a>
            <a href="#amenities" onClick={scrollToSection("amenities")}>Amenities</a>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleOpenConcierge();
                sendMessage("What are the hotel check-in, check-out, and cancellation policies?");
              }}
            >
              Policies
            </a>
            <a href="#contact" onClick={scrollToSection("contact")}>Contact</a>
          </div>

          <div>
            <h4>Contact</h4>
            <span>PRASHIV</span>
            <span>Key West, Florida</span>
            <a href="tel:+1234567890" style={{ color: "inherit", textDecoration: "none" }}>+1 234 567 890</a>
            <a href="mailto:hello@prashiv.com" style={{ color: "inherit", textDecoration: "none" }}>hello@prashiv.com</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 PRASHIV</span>
          <span>Privacy Policy · Terms</span>
        </div>
      </footer>

      {/* ================= DINING MODAL ================= */}
      <DiningModal
        isOpen={isDiningModalOpen}
        onClose={() => setIsDiningModalOpen(false)}
        onAskConcierge={(query) => {
          handleOpenConcierge();
          sendMessage(query);
        }}
      />
    </div>
  );
}

export default App;