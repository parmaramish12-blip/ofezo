import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#111",
          color: "#fff",
          padding: "20px"
        }}
      >
        <h2>OFEZO Admin</h2>

        <div style={{ marginTop: "30px" }}>
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
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "25px" }}>
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;
