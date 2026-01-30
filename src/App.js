import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import AddOffer from "./pages/AddOffer";
import EditOffer from "./pages/EditOffer";
import SavedOffers from "./pages/SavedOffers";
import OfferDetails from "./pages/OfferDetails";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOffers from "./pages/AdminOffers";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="app-wrapper">
      <ScrollToTop />

      <Navbar />

      <div className="page-content">
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />

          <Route path="/login" element={<Login />} />

          {/* SELLER */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-offer"
            element={
              <ProtectedRoute>
                <AddOffer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-offer/:id"
            element={
              <ProtectedRoute>
                <EditOffer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved-offers"
            element={
              <ProtectedRoute>
                <SavedOffers />
              </ProtectedRoute>
            }
          />

          <Route path="/offer/:id" element={<OfferDetails />} />

          {/* 🔐 ADMIN (NESTED ROUTES) */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="offers" element={<AdminOffers />} />
          </Route>

        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
