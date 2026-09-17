import { useState } from "react";
import { X, Clock, Coffee, Utensils, Wine, Check, MessageSquare, PhoneCall } from "lucide-react";
import hotelData from "../../../backend/data/hotelData.json";

const categories = [
  { id: "all", label: "All Items" },
  { id: "starters", label: "Starters & Soups" },
  { id: "veg", label: "Vegetarian" },
  { id: "non-veg", label: "Non-Vegetarian" },
  { id: "desserts", label: "Desserts" },
  { id: "beverages", label: "Beverages" },
];

function DiningModal({ isOpen, onClose, onAskConcierge }) {
  const [activeCategory, setActiveCategory] = useState("all");

  if (!isOpen) return null;

  const dining = hotelData.dining || {};
  const foodMenu = dining.foodMenu || {};

  const vegetarian = (foodMenu.vegetarian || []).map((item) => ({ ...item, isVeg: true }));
  const nonVegetarian = (foodMenu.nonVegetarian || []).map((item) => ({ ...item, isVeg: false }));
  const starters = [
    ...(foodMenu.starters || []).map((s) => ({ ...s, isVeg: s.type === "Vegetarian", category: "Starter" })),
    ...(foodMenu.soups || []).map((s) => ({ ...s, isVeg: s.type === "Vegetarian", category: "Soup" })),
  ];
  const desserts = (foodMenu.desserts || []).map((d) => ({ ...d, isVeg: true, category: "Dessert" }));
  const beverages = (foodMenu.beverages || []).map((b) => ({ ...b, isVeg: true, category: "Beverage" }));

  let displayedItems = [];
  if (activeCategory === "all") {
    displayedItems = [...starters, ...vegetarian, ...nonVegetarian, ...desserts, ...beverages];
  } else if (activeCategory === "starters") {
    displayedItems = starters;
  } else if (activeCategory === "veg") {
    displayedItems = vegetarian;
  } else if (activeCategory === "non-veg") {
    displayedItems = nonVegetarian;
  } else if (activeCategory === "desserts") {
    displayedItems = desserts;
  } else if (activeCategory === "beverages") {
    displayedItems = beverages;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dining-modal-container"
        style={{
          backgroundColor: "#141414",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          height: "90vh",
          color: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="dining-modal-header"
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexShrink: 0,
            background: "#141414",
          }}
        >
          <div>
            <span
              style={{
                color: "#ff6a00",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              TASTE THE EXPERIENCE
            </span>
            <h3
              style={{
                fontSize: "22px",
                margin: "4px 0 6px",
                fontWeight: "700",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              PRASHIV Restaurant & Dining
            </h3>
            <p style={{ margin: 0, color: "#a5a5a5", fontSize: "13px" }}>
              Multi-cuisine dining featuring South Indian, North Indian, Asian, and Continental favorites.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
              marginLeft: "16px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Timings Strip */}
        <div
          className="dining-timings-strip"
          style={{
            background: "#191919",
            padding: "12px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Coffee size={16} color="#ff6a00" />
            <div>
              <div style={{ fontSize: "11px", color: "#a5a5a5", textTransform: "uppercase" }}>Breakfast</div>
              <strong style={{ fontSize: "12px" }}>7:00 AM – 10:30 AM</strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Utensils size={16} color="#ff6a00" />
            <div>
              <div style={{ fontSize: "11px", color: "#a5a5a5", textTransform: "uppercase" }}>Lunch</div>
              <strong style={{ fontSize: "12px" }}>12:30 PM – 3:30 PM</strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Wine size={16} color="#ff6a00" />
            <div>
              <div style={{ fontSize: "11px", color: "#a5a5a5", textTransform: "uppercase" }}>Dinner</div>
              <strong style={{ fontSize: "12px" }}>7:00 PM – 11:00 PM</strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={16} color="#22c55e" />
            <div>
              <div style={{ fontSize: "11px", color: "#a5a5a5", textTransform: "uppercase" }}>Room Service</div>
              <strong style={{ fontSize: "12px", color: "#22c55e" }}>7:00 AM – 11:00 PM</strong>
            </div>
          </div>
        </div>

        {/* Menu Categories Tab */}
        <div
          className="dining-categories-strip"
          style={{
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            background: "#161616",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            flexShrink: 0,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: activeCategory === cat.id ? "1.5px solid #ff6a00" : "1px solid rgba(255, 255, 255, 0.15)",
                background: activeCategory === cat.id ? "rgba(255, 106, 0, 0.2)" : "rgba(255, 255, 255, 0.04)",
                color: activeCategory === cat.id ? "#ff6a00" : "#d1d5db",
                fontSize: "13px",
                fontWeight: activeCategory === cat.id ? "700" : "500",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1.4",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div
          className="dining-menu-body"
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            flex: "1 1 auto",
            minHeight: 0,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
              gap: "14px",
            }}
          >
            {displayedItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "#1b1b1b",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          border: item.isVeg ? "2px solid #22c55e" : "2px solid #ef4444",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "2px",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: item.isVeg ? "#22c55e" : "#ef4444",
                          }}
                        />
                      </span>
                      <strong style={{ fontSize: "14px", color: "#ffffff" }}>{item.name}</strong>
                    </div>

                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#ff6a00" }}>
                      ₹{item.price}
                    </span>
                  </div>

                  {item.category && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        color: "#a5a5a5",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {item.category}
                    </span>
                  )}

                  {item.description && (
                    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#9ca3af", lineHeight: "1.4" }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="dining-modal-footer"
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            background: "#161616",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#a5a5a5" }}>
            <PhoneCall size={14} color="#ff6a00" />
            <span>Dial <strong>0</strong> from your room intercom for 24/7 in-room dining</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="secondary-btn"
              onClick={() => {
                onClose();
                if (onAskConcierge) onAskConcierge("Tell me about dining and restaurant menu");
              }}
              style={{
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <MessageSquare size={15} />
              Ask Concierge
            </button>

            <button
              className="primary-btn"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiningModal;
