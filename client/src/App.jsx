import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BannerManagement from "./pages/admin/BannerManagement";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-20 pt-6 sm:px-6 md:pt-8 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute>
                <BannerManagement />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default App;
