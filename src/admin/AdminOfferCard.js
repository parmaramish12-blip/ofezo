import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function AdminOfferCard({ offer }) {

  const makeFeatured = async (days) => {
    const till = new Date();
    till.setDate(till.getDate() + days);

    await updateDoc(doc(db, "offers", offer.id), {
      featured: true,
      featuredTill: Timestamp.fromDate(till),
    });

    alert(`Featured for ${days} days`);
  };

  const removeFeatured = async () => {
    await updateDoc(doc(db, "offers", offer.id), {
      featured: false,
      featuredTill: null,
    });
  };

  return (
    <div style={{
      border: "1px solid #ccc",
      padding: 15,
      marginBottom: 15,
      borderRadius: 8
    }}>
      <h4>{offer.title}</h4>

      {offer.featured && (
        <p>⭐ Featured</p>
      )}

      {!offer.featured ? (
        <>
          <button onClick={() => makeFeatured(7)}>
            Feature 7 Days
          </button>

          <button onClick={() => makeFeatured(14)}>
            Feature 14 Days
          </button>
        </>
      ) : (
        <button onClick={removeFeatured}>
          Remove Featured
        </button>
      )}
    </div>
  );
}
