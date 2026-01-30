import { Outlet, Link } from "react-router-dom";
import AdminRoute from "../components/AdminRoute";

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div style={{ display: "flex", minHeight: "80vh" }}>

        {/* SIDEBAR */}
        <div
          style={{
            width: "220px",
            background: "#111",
            color: "#fff",
            padding: "20px",
          }}
        >
          <h3>OFEZO Admin</h3>

          <p>
            <Link to="/admin" style={{ color: "#fff" }}>
              Dashboard
            </Link>
          </p>

          <p>
            <Link to="/admin/offers" style={{ color: "#fff" }}>
              Offers
            </Link>
          </p>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "30px" }}>
          <Outlet />
        </div>

      </div>
    </AdminRoute>
  );
}
