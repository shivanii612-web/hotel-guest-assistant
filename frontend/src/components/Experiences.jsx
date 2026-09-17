import { useState } from "react";
import ExperienceModal from "./ExperienceModal";

const experienceGallery = {
  "Infinity Pool": [
    {
      url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85",
      caption: "PRASHIV Infinity Pool with Ocean Horizon View",
      alt: "PRASHIV luxury outdoor infinity pool overlooking ocean",
    },
    {
      url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85",
      caption: "Resort Swimming Pool & Sun Loungers",
      alt: "Resort swimming pool with comfortable sun loungers",
    },
    {
      url: "https://images.unsplash.com/photo-1760564019141-abe33455ce02?auto=format&fit=crop&w=1200&q=85",
      caption: "Infinity Pool Overlooking Turquoise Ocean",
      alt: "Infinity pool overlooking turquoise ocean with resort view",
    },
    {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
      caption: "Evening Sunset Horizon at the Resort Pool",
      alt: "Evening sunset view at resort infinity pool",
    },
  ],
  "Fine Dining": [
    {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
      caption: "PRASHIV Fine Dining Restaurant Ambience",
      alt: "Fine dining restaurant interior and elegant ambience",
    },
    {
      url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
      caption: "Gourmet Culinary Presentation",
      alt: "Gourmet culinary presentation prepared by master chefs",
    },
    {
      url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85",
      caption: "Luxury Dining Table Setting",
      alt: "Luxury restaurant dining table and glassware setting",
    },
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85",
      caption: "Signature Multi-Cuisine Dining Experience",
      alt: "Hotel dining experience with signature culinary dishes",
    },
  ],
  "Spa & Wellness": [
    {
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
      caption: "PRASHIV Wellness Spa Sanctuary",
      alt: "PRASHIV Wellness Spa treatment and relaxation suite",
    },
    {
      url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=85",
      caption: "Holistic Body & Massage Therapy",
      alt: "Holistic body relaxation massage therapy session",
    },
    {
      url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=85",
      caption: "Aromatherapy Oils & Warm Herbal Stones",
      alt: "Aromatherapy essential oils and warm herbal stones",
    },
    {
      url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85",
      caption: "Floral Bath & Peaceful Wellness Retreat",
      alt: "Floral bath and tranquil spa relaxation room",
    },
  ],
  "Beach Experience": [
    {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
      caption: "Pristine White Sands & Turquoise Waters",
      alt: "Pristine white sand beach and turquoise ocean waters",
    },
    {
      url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85",
      caption: "Golden Ocean Sunset",
      alt: "Golden sunset over calm ocean horizon",
    },
    {
      url: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1200&q=85",
      caption: "Private Coastal Loungers & Ocean Breeze",
      alt: "Private beach loungers with umbrellas on the sand",
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      caption: "Serene Evening Beach Walks",
      alt: "Tranquil evening coastal walk with ocean waves",
    },
  ],
};

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

function Experiences() {
  const [selectedExperience, setSelectedExperience] = useState(null);

  const handleOpenGallery = (item) => {
    setSelectedExperience({
      title: item.title,
      gallery: experienceGallery[item.title] || [
        { url: item.image, alt: item.title, caption: item.title },
      ],
    });
  };

  return (
    <section className="section experiences-section" id="experiences">
      <div className="center-heading">
        <span className="eyebrow">EXPERIENCES TO INSPIRE</span>
        <h2>Make Your Stay Memorable</h2>
        <p>Discover experiences designed to make every moment special.</p>
      </div>

      <div className="experience-grid">
        {experiences.map((experience) => (
          <div
            className="experience-card"
            key={experience.title}
            onClick={() => handleOpenGallery(experience)}
            style={{ cursor: "pointer" }}
          >
            <img src={experience.image} alt={experience.title} />
            <div className="experience-overlay">
              <h3>{experience.title}</h3>
              <span
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenGallery(experience);
                }}
              >
                Explore Experience →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Experience Gallery Lightbox Modal */}
      <ExperienceModal
        isOpen={Boolean(selectedExperience)}
        onClose={() => setSelectedExperience(null)}
        experience={selectedExperience}
      />
    </section>
  );
}

export default Experiences;