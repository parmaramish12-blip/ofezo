import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    offers: 0,
    active: 0,
    expired: 0,
  });

  useEffect(() => {
    const load = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const offersSnap = await getDocs(collection(db, "offers"));

      const today = new Date().toISOString().split("T")[0];

      let sellers = 0;
      let active = 0;
      let expired = 0;

      usersSnap.docs.forEach((u) => {
        if (u.data().businessProfile) sellers++;
      });

      offersSnap.docs.forEach((o) => {
        if (o.data().expiryDate < today) expired++;
        else if (o.data().isActive) active++;
      });

      setStats({
        users: usersSnap.size,
        sellers,
        offers: offersSnap.size,
        active,
        expired,
      });
    };

    load();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20 }}>
        <Stat title="Users" value={stats.users} />
        <Stat title="Sellers" value={stats.sellers} />
        <Stat title="Offers" value={stats.offers} />
        <Stat title="Active" value={stats.active} />
        <Stat title="Expired" value={stats.expired} />
      </div>
    </div>
  );
}

const Stat = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      textAlign: "center",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    }}
  >
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);
