const galleryImages = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
];

function Gallery() {
  return (
    <section className="section gallery-section" id="gallery">
      <div className="section-title-center">
        <p className="section-label">A GLIMPSE OF PRASHIV</p>
        <h2>Our Gallery</h2>
      </div>

      <div className="gallery-grid">
        {galleryImages.map((image, index) => (
          <div className="gallery-item" key={index}>
            <img
              src={image}
              alt={`PRASHIV gallery ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;