import { Link } from "react-router-dom";
import "../styles/home.css";

function OfferCard({ offer }) {
  return (
    <Link to={`/offer/${offer.id}`} className="offer-card">
      <div className="offer-img">
        <img
          src={offer.imageUrl}
          alt={offer.title}
        />
      </div>

      <div className="offer-content">
        <h3>{offer.title}</h3>

        <p className="offer-location">
          📍 {offer.city} • {offer.category}
        </p>

        <p className="offer-price">₹ {offer.price}</p>

        <p className="offer-view">
          👁 {offer.views || 0} views
        </p>
      </div>
    </Link>
  );
}

export default OfferCard;
