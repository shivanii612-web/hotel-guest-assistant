import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

function ExperienceModal({ isOpen, onClose, experience }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when modal opens or experience changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, experience]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, experience]);

  if (!isOpen || !experience) return null;

  const images = experience.gallery && experience.gallery.length > 0
    ? experience.gallery
    : [
        {
          url: experience.image,
          caption: experience.title,
          alt: experience.title,
        },
      ];

  const total = images.length;
  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(10px)",
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
        className="experience-modal-container"
        style={{
          backgroundColor: "#141414",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "760px",
          maxHeight: "92vh",
          overflow: "hidden",
          color: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            background: "#161616",
          }}
        >
          <div>
            <span
              style={{
                color: "#ff6a00",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              PRASHIV EXPERIENCE GALLERY
            </span>
            <h3
              style={{
                fontSize: "20px",
                margin: "3px 0 0",
                fontWeight: "700",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {experience.title}
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#a5a5a5",
                background: "rgba(255, 255, 255, 0.08)",
                padding: "4px 10px",
                borderRadius: "12px",
              }}
            >
              {currentIndex + 1} / {total}
            </span>

            <button
              onClick={onClose}
              aria-label="Close gallery"
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "#ffffff",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Image Stage */}
        <div
          className="experience-image-stage"
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(240px, 46vh, 400px)",
            backgroundColor: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          <img
            key={currentImage.url}
            src={currentImage.url}
            alt={currentImage.alt || `${experience.title} image ${currentIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s ease",
            }}
          />

          {/* Image Caption Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "24px 20px 14px",
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#f3f4f6" }}>
              {currentImage.caption || currentImage.alt || experience.title}
            </span>
          </div>

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                className="modal-nav-arrow modal-prev"
                onClick={handlePrev}
                aria-label="Previous image"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.65)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                className="modal-nav-arrow modal-next"
                onClick={handleNext}
                aria-label="Next image"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.65)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Navigation Strip */}
        {total > 1 && (
          <div
            className="experience-thumbnail-strip"
            style={{
              padding: "14px 20px",
              background: "#161616",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              gap: "10px",
              justifyContent: total > 4 ? "flex-start" : "center",
              overflowX: "auto",
              flexShrink: 0,
            }}
          >
            {images.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                style={{
                  width: "80px",
                  height: "56px",
                  padding: 0,
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: idx === currentIndex ? "2px solid #ff6a00" : "1px solid rgba(255, 255, 255, 0.15)",
                  opacity: idx === currentIndex ? 1 : 0.5,
                  cursor: "pointer",
                  background: "#000000",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                <img
                  src={item.url}
                  alt={item.alt || `Thumbnail ${idx + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExperienceModal;
