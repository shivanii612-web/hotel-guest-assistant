const experiences = [
  {
    title: "Swimming Pool",
    text: "Relax by the pool and enjoy peaceful moments.",
    image: "/images/pool.jpg",
  },
  {
    title: "Spa & Wellness",
    text: "Recharge your body and mind with our wellness services.",
    image: "/images/spa.jpg",
  },
  {
    title: "Fitness Center",
    text: "Stay active during your stay with modern equipment.",
    image: "/images/gym.jpg",
  },
  {
    title: "Beach Activities",
    text: "Discover memorable outdoor experiences.",
    image: "/images/beach.jpg",
  },
];

function Experiences() {
  return (
    <section className="section experiences" id="experiences">
      <div className="section-title-center">
        <p className="section-label">DISCOVER YOUR STAY</p>
        <h2>Experiences to Inspire</h2>
      </div>

      <div className="experience-grid">
        {experiences.map((item) => (
          <div className="experience-card" key={item.title}>
            <img src={item.image} alt={item.title} />

            <div className="experience-overlay">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experiences;