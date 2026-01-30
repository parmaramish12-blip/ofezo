import AdminRoute from "../components/AdminRoute";

const AdminDashboard = () => {
  return (
    <AdminRoute>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome to OFEZO admin panel.</p>

        <div style={{ marginTop: "20px" }}>
          <p>✔ Total Sellers</p>
          <p>✔ Total Offers</p>
          <p>✔ Active Offers</p>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
