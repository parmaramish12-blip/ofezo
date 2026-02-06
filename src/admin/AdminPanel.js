import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function AdminPanel() {
  const [stats, setStats] = useState({
    users: 0,
    offers: 0,
    activeOffers: 0,
    admins: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [offersByUser, setOffersByUser] = useState({});
  const [liveOffers, setLiveOffers] = useState([]);
  const [error, setError] = useState(null);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const ra = a.role === "admin" ? 0 : 1;
      const rb = b.role === "admin" ? 0 : 1;
      if (ra !== rb) return ra - rb;
      return (a.name || a.email).localeCompare(b.name || b.email);
    });
  }, [users]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const userSnap = await getDocs(collection(db, "users"));
        const offerSnap = await getDocs(collection(db, "offers"));
        const activeSnap = await getDocs(
          query(collection(db, "offers"), where("isActive", "==", true))
        );

        const userList = userSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        const offerList = offerSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const adminCount = userList.filter((u) => u.role === "admin").length;

        if (!mounted) return;

        setUsers(userList);
        setOffersByUser(
          offerList.reduce((acc, o) => {
            const key = o.sellerId || "unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {})
        );
        const now = new Date();
        const live = offerList.filter((o) => {
          const active = o.isActive === true;
          const notExpired =
            !o.expiryDate ||
            (typeof o.expiryDate?.toDate === "function"
              ? o.expiryDate.toDate()
              : new Date(o.expiryDate)) > now;
          return active && notExpired;
        });
        setLiveOffers(live);
        setStats({
          users: userList.length,
          offers: offerList.length,
          activeOffers: activeSnap.size,
          admins: adminCount,
        });
      } catch (e) {
        setError("Failed to load admin data");
        console.error("AdminPanel load error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const makeAdminByEmail = async () => {
    const email = emailInput.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      alert("Enter a valid email");
      return;
    }

    setSaving(true);
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("No user found with this email");
        setSaving(false);
        return;
      }

      const d = snap.docs[0];
      await updateDoc(doc(db, "users", d.id), {
        role: "admin",
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === d.id ? { ...u, role: "admin" } : u))
      );
      setStats((prev) => ({ ...prev, admins: prev.admins + 1 }));
      setEmailInput("");
      alert("Admin granted");
    } catch (e) {
      alert("Failed to grant admin");
    } finally {
      setSaving(false);
    }
  };

  const promoteUser = async (id) => {
    await updateDoc(doc(db, "users", id), { role: "admin" });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "admin" } : u))
    );
    setStats((prev) => ({ ...prev, admins: prev.admins + 1 }));
  };

  const demoteUser = async (id) => {
    await updateDoc(doc(db, "users", id), { role: "user" });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "user" } : u))
    );
    setStats((prev) => ({ ...prev, admins: Math.max(0, prev.admins - 1) }));
  };

  const toggleOfferActive = async (id, value) => {
    await updateDoc(doc(db, "offers", id), { isActive: value });
    setStats((prev) => ({
      ...prev,
      activeOffers: prev.activeOffers + (value ? 1 : -1),
    }));
    setLiveOffers((prev) =>
      value
        ? prev
        : prev.filter((o) => o.id !== id)
    );
  };

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    await deleteDoc(doc(db, "offers", id));
    setLiveOffers((prev) => prev.filter((o) => o.id !== id));
    setStats((prev) => ({
      ...prev,
      offers: Math.max(0, prev.offers - 1),
      activeOffers: Math.max(0, prev.activeOffers - 1),
    }));
  };

  const userIndex = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      map[u.id] = u.name || u.email?.split("@")[0] || "User";
    });
    return map;
  }, [users]);

  

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        <h3>Loading admin panel…</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 30 }}>
        <h3 style={{ color: "#ef4444" }}>{error}</h3>
        <p style={{ color: "#94a3b8" }}>
          Please refresh or try again later.
        </p>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              background:
                "linear-gradient(90deg, #06b6d4 0%, #22d3ee 40%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin Panel
          </h1>
          <p style={{ marginTop: 6, color: "#64748b" }}>
            Manage users and offers in one place
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#0b1220",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #1f2937",
          }}
        >
          <input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Make admin by email"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e5e7eb",
              width: 240,
            }}
          />
          <button
            onClick={makeAdminByEmail}
            disabled={saving}
            style={{
              background:
                "linear-gradient(90deg, #22c55e, #16a34a)",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: 8,
              cursor: "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            Make Admin
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <div style={statCard("#0ea5e9")}>
          <small style={statLabel}>Users</small>
          <h3 style={statValue}>{stats.users}</h3>
        </div>
        <div style={statCard("#22c55e")}>
          <small style={statLabel}>Offers</small>
          <h3 style={statValue}>{stats.offers}</h3>
        </div>
        <div style={statCard("#f59e0b")}>
          <small style={statLabel}>Active Offers</small>
          <h3 style={statValue}>{stats.activeOffers}</h3>
        </div>
        <div style={statCard("#a78bfa")}>
          <small style={statLabel}>Admins</small>
          <h3 style={statValue}>{stats.admins}</h3>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 24,
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <SectionHeader title="Users" />
          <div style={{ border: "1px solid #1f2937", borderRadius: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1.6fr 0.8fr 0.8fr 180px",
                padding: "12px 14px",
                background: "#0b1220",
                color: "#94a3b8",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Offers</span>
              <span>Subscription</span>
              <span>Actions</span>
            </div>

            {sortedUsers.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1.6fr 0.8fr 0.8fr 180px",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderTop: "1px solid #1f2937",
                }}
              >
                <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  <div style={{ color: "#e5e7eb" }}>
                    {u.name || u.email?.split("@")[0] || "User"}
                  </div>
                </div>
                <div style={{ color: "#94a3b8" }}>{u.email}</div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      background:
                        u.role === "admin"
                          ? "#1e293b"
                          : "#111827",
                      border:
                        "1px solid " +
                        (u.role === "admin" ? "#a78bfa" : "#374151"),
                      color:
                        u.role === "admin" ? "#c4b5fd" : "#9ca3af",
                    }}
                  >
                    {u.role || "user"}
                  </span>
                </div>
                <div style={{ color: "#94a3b8" }}>
                  {offersByUser[u.id] || 0}
                </div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      background: "#111827",
                      border: "1px solid #374151",
                      color:
                        u.subscription?.active ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {u.subscription?.active ? "Active" : "Expired"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {u.role === "admin" ? (
                    <button
                      onClick={() => demoteUser(u.id)}
                      style={btnSecondary}
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => promoteUser(u.id)}
                      style={btnPrimary}
                    >
                      Make Admin
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <SectionHeader title="Live Offers" />
          <div style={{ border: "1px solid #1f2937", borderRadius: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 160px",
                padding: "12px 14px",
                background: "#0b1220",
                color: "#94a3b8",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <span>Title</span>
              <span>Seller</span>
              <span>Expiry</span>
              <span>Actions</span>
            </div>
            {liveOffers.length === 0 && (
              <div style={{ padding: 16, color: "#94a3b8" }}>
                No live offers
              </div>
            )}
            {liveOffers.map((o) => {
              const expiry =
                o.expiryDate &&
                (typeof o.expiryDate?.toDate === "function"
                  ? o.expiryDate.toDate()
                  : new Date(o.expiryDate));
              return (
                <div
                  key={o.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 160px",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 14px",
                    borderTop: "1px solid #1f2937",
                  }}
                >
                  <div style={{ color: "#e5e7eb" }}>{o.title}</div>
                  <div style={{ color: "#94a3b8" }}>
                    {userIndex[o.sellerId] || "Unknown"}
                  </div>
                  <div style={{ color: "#94a3b8" }}>
                    {expiry ? expiry.toLocaleDateString() : "—"}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => toggleOfferActive(o.id, false)}
                      style={btnSecondary}
                    >
                      Disable
                    </button>
                    <button
                      onClick={() => deleteOffer(o.id)}
                      style={btnWarn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      <div
        style={{
          height: 1,
          flex: 1,
          marginLeft: 12,
          background:
            "linear-gradient(90deg, rgba(99,102,241,0.2), rgba(99,102,241,0))",
        }}
      />
    </div>
  );
}


const statCard = (color) => ({
  background: "linear-gradient(180deg, #0b1220, #0b1220)",
  border: "1px solid #1f2937",
  borderRadius: 12,
  padding: "14px 16px",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 0 0 1px #0b1220 inset",
});

const statLabel = {
  color: "#94a3b8",
  fontSize: 13,
};

const statValue = {
  marginTop: 6,
  fontSize: 22,
  color: "#e5e7eb",
};

const btnPrimary = {
  background: "linear-gradient(90deg, #06b6d4, #22d3ee)",
  color: "#0b1220",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const btnSecondary = {
  background: "#0b1220",
  color: "#e5e7eb",
  border: "1px solid #374151",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnWarn = {
  background: "linear-gradient(90deg, #f59e0b, #f97316)",
  color: "#0b1220",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};
