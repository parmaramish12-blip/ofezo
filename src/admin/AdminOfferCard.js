import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const AdminOfferCard = ({ offer }) => {

  const publishOffer = async () => {
    await updateDoc(doc(db, "offers", offer.id), {
      isActive: true,
      status: "published",
      publishedBy: "admin"
    });
  };

  const unpublishOffer = async () => {
    await updateDoc(doc(db, "offers", offer.id), {
      isActive: false
    });
  };

  const deleteOffer = async () => {
    if (window.confirm("Delete this offer?")) {
      await deleteDoc(doc(db, "offers", offer.id));
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px"
      }}
    >
      <h3>{offer.title}</h3>
      <p>{offer.description}</p>

      <p>
        Status: {offer.isActive ? "🟢 Active" : "⚪ Draft"}
      </p>

      <div style={{ marginTop: "10px" }}>
        {!offer.isActive && (
          <button onClick={publishOffer}>
            Publish
          </button>
        )}

        {offer.isActive && (
          <button onClick={unpublishOffer}>
            Unpublish
          </button>
        )}

        <button
          onClick={deleteOffer}
          style={{ marginLeft: "10px", color: "red" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminOfferCard;
