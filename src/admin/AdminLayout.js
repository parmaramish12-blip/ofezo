import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b1220", color: "#e5e7eb" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: "240px",
          background: "#0b1220",
          color: "#e5e7eb",
          padding: "20px",
          borderRight: "1px solid #1f2937"
        }}
      >
        <h2 style={{ margin: 0, background: "linear-gradient(90deg,#06b6d4,#22d3ee,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OFEZO Admin</h2>

        <div style={{ marginTop: "30px" }}>
          <p style={{ marginBottom: 12 }}>
            <Link to="/admin" style={{ color: "#e5e7eb", textDecoration: "none" }}>
              📊 Dashboard
            </Link>
          </p>

          <p style={{ marginBottom: 12 }}>
            <Link to="/admin/offers" style={{ color: "#e5e7eb", textDecoration: "none" }}>
              📦 Offers
            </Link>
          </p>

          <p style={{ marginBottom: 12 }}>
            <Link to="/admin/payments" style={{ color: "#e5e7eb", textDecoration: "none" }}>
              💳 Payments
            </Link>
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "25px" }}>
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;
