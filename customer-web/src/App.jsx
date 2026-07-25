import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { PublicLayout } from "./layouts/PublicLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { SupportPage } from "./pages/SupportPage";
import { LoginRedirect } from "./pages/LoginRedirect";
import { OrdersPage } from "./pages/dashboard/OrdersPage";
import { OrderTrackingPage } from "./pages/dashboard/OrderTrackingPage";
import { AddressesPage } from "./pages/dashboard/AddressesPage";
import { ProfilePage } from "./pages/dashboard/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>
          <ToastProvider>
            <CartProvider>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="services/:id" element={<ServiceDetailPage />} />
                  <Route path="how-it-works" element={<HowItWorksPage />} />
                  <Route path="about-us" element={<AboutUsPage />} />
                  <Route path="support" element={<SupportPage />} />
                  <Route path="login" element={<LoginRedirect />} />
                </Route>

                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/app/orders" replace />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="orders/:id" element={<OrderTrackingPage />} />
                  <Route path="addresses" element={<AddressesPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="support" element={<SupportPage embedded />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CartProvider>
          </ToastProvider>
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
