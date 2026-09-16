import {
  BedDouble,
  Utensils,
  Waves,
  Flower2,
  Wifi,
  CarFront,
} from "lucide-react";

const highlights = [
  {
    icon: BedDouble,
    title: "Luxury Rooms",
  },
  {
    icon: Utensils,
    title: "Fine Dining",
  },
  {
    icon: Waves,
    title: "Swimming Pool",
  },
  {
    icon: Flower2,
    title: "Wellness & Spa",
  },
  {
    icon: Wifi,
    title: "Free Wi-Fi",
  },
  {
    icon: CarFront,
    title: "Secure Parking",
  },
];

function HotelHighlights() {
  return (
    <section className="highlights">
      {highlights.map((item, index) => {
        const Icon = item.icon;

        return (
          <div className="highlight-item" key={index}>
            <Icon size={25} />
            <span>{item.title}</span>
          </div>
        );
      })}
    </section>
  );
}

export default HotelHighlights;