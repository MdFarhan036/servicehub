import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Admin from "./pages/Admin";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";   // ⭐ NEW

// Footer Pages
import About from "./pages/About";
import InvestorRelations from "./pages/InvestorRelations";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Careers from "./pages/Careers";
import Reviews from "./pages/Reviews";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";

import ProtectedRoute from "./components/ProtectedRoute";
import HomePopularServices from "./components/popular/HomePopularServices";
import PopularServiceDetail from "./components/popular/PopularServiceDetail";
import HomeDailyDeals from "./components/daily-deals/HomeDailyDeals";
import DailyDealDetail from "./components/daily-deals/DailyDealDetail";
import CategoryServicesPage from "./components/categories/CategoryServicesPage";
import PopularServicesPage from "./components/popular/PopularServicesPage";
import DailyDealsPage from "./components/daily-deals/DailyDealsPage";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import MyBookings from "./pages/MyBookings";
import BookingDetail from "./pages/BookingDetail";
import AllCategoryServices from "./components/all-categories/AllCategoryServices";

import ChatbotButton from "./components/chatbot/ChatbotButton/ChatbotButton";
import ChatbotWindow from "./components/chatbot/ChatbotWindow/ChatbotWindow";
import { useState } from "react";
function App() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [chatOpen, setChatOpen] =
    useState(false);
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      <ScrollToTop />

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route
                path="/services/category/:id"
                element={<CategoryServicesPage />}
              />
              <Route path="/popular-services" element={<HomePopularServices />} />
              <Route path="/popular-services-listing" element={<PopularServicesPage />} />
              <Route
                path="/popular-services/:id"
                element={<PopularServiceDetail />}
              />
              <Route path="/daily-deals" element={<HomeDailyDeals />} />

              <Route
                path="/daily-deals/:id"
                element={<DailyDealDetail />}
              />
              <Route
                path="/daily-deals-listing"
                element={<DailyDealsPage />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Footer Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/investors" element={<InvestorRelations />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/all-categories" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route
                path="/blogs/:slug"
                element={<BlogDetails />}
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/:id"
                element={
                  <ProtectedRoute>
                    <BookingDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              {/* ⭐ NEW BOOKINGS PAGE */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />

      <ChatbotButton
        onClick={() =>
          setChatOpen(
            (current) => !current
          )
        }
        open={chatOpen}
      />


      <ChatbotWindow
        isOpen={chatOpen}
        onClose={() =>
          setChatOpen(false)
        }
      />
    </div>
  );
}

export default App;