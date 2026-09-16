import { Coffee, Utensils, Wine } from "lucide-react";

function Dining() {
  return (
    <section className="dining-section" id="dining">
      <div className="dining-image">
        <img
          src="/images/restaurant.jpg"
          alt="PRASHIV Restaurant"
        />
      </div>

      <div className="dining-content">
        <p className="section-label">SIGNATURE DINING</p>

        <h2>Taste the Experience</h2>

        <p>
          Savour exquisite flavours at our signature restaurant,
          where every meal is a journey.
        </p>

        <div className="dining-times">
          <span>
            <Coffee size={17} />
            Breakfast
            <b>6:30 AM – 10:30 AM</b>
          </span>

          <span>
            <Utensils size={17} />
            Lunch
            <b>12:30 PM – 3:00 PM</b>
          </span>

          <span>
            <Wine size={17} />
            Dinner
            <b>7:00 PM – 11:00 PM</b>
          </span>
        </div>

        <button className="primary-btn">
          Explore Dining →
        </button>
      </div>
    </section>
  );
}

export default Dining;