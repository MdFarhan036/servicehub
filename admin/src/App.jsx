import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import {
  AuthProvider
} from "./components/context/AuthContext";

import {
  HelmetProvider
} from "react-helmet-async";

import RoleRoute from "./components/RoleRoute";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import Comments from "./pages/Comments";

import AdminLayout from "./layout/AdminLayout";

import AddService from "./pages/AddService";

import Categories from "./pages/Categories";
import AddCategory from "./pages/AddCategory";

import AboutAdmin from "./pages/AboutAdmin";
import AboutForm from "./pages/AboutForm";

import HighlightsAdmin from "./pages/HighlightsAdmin";
import HighlightForm from "./pages/HighlightForm";

import TestimonialsAdmin from "./pages/TestimonialsAdmin";
import TestimonialForm from "./pages/TestimonialForm";
import TestimonialsSettings from "./pages/TestimonialsSettings";

import FaqsAdmin from "./pages/FaqsAdmin";
import FaqForm from "./pages/FaqForm";

import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import ViewUser from "./pages/ViewUser";
import EditUser from "./pages/EditUser";

import ReviewsAdmin from "./pages/ReviewsAdmin";
import ReviewForm from "./pages/ReviewForm";

import BlogsAdmin from "./pages/BlogsAdmin";
import BlogForm from "./pages/BlogForm";

import BlogPageForm from "./pages/BlogPageForm";

import CategoryPageContentForm from
  "./pages/CategoryPageContentForm";

import AdminContacts from "./pages/AdminContacts";

import ChatbotFAQs from
  "./pages/Chatbot/ChatbotFAQs";

import ChatbotManagement from
  "./pages/ChatbotManagement";

import QuickReplyManagement from
  "./pages/QuickReplyManagement";

import AdminEarnings from
  "./pages/AdminEarnings";
import HomeRedirect from
  "./components/HomeRedirect";
  import AdminWithdrawals from "./pages/AdminWithdrawals";

import Notifications from "./pages/Notifications";
  import "./App.css";


function App() {

  return (

    <HelmetProvider>

      <AuthProvider>

        <BrowserRouter>

          <Routes>


            {/* =====================
                LOGIN
            ===================== */}

            <Route
              path="/login"
              element={<Login />}
            />


            {/* =====================
                ROOT
            ===================== */}

          <Route
  path="/"
  element={
    <HomeRedirect />
  }
/>


            {/* ==================================
                ADMIN PROTECTED ROUTES
            ================================== */}

        <Route
  element={
    <RoleRoute
      allowedRoles={["admin"]}
    />
  }
>

              <Route
                element={
                  <AdminLayout />
                }
              >


                {/* DASHBOARD */}

                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />


                {/* ADMIN EARNINGS */}

                <Route
                  path="/admin/earnings"
                  element={<AdminEarnings />}
                />


                {/* USERS */}

                <Route
                  path="/users"
                  element={<Users />}
                />

                <Route
                  path="/users/add"
                  element={<AddUser />}
                />

                <Route
                  path="/users/:id"
                  element={<ViewUser />}
                />

                <Route
                  path="/users/edit/:id"
                  element={<EditUser />}
                />


                {/* CHATBOT */}

                <Route
                  path="/chatbot"
                  element={
                    <ChatbotManagement />
                  }
                />

                <Route
                  path="/chatbot/quick-replies"
                  element={
                    <QuickReplyManagement />
                  }
                />

                <Route
                  path="/chatbot/faqs"
                  element={
                    <ChatbotFAQs />
                  }
                />


                {/* CATEGORIES */}

                <Route
                  path="/categories"
                  element={<Categories />}
                />

                <Route
                  path="/category-page-content"
                  element={
                    <CategoryPageContentForm />
                  }
                />

                <Route
                  path="/categories/add"
                  element={<AddCategory />}
                />

                <Route
                  path="/categories/edit/:id"
                  element={<AddCategory />}
                />


                {/* SERVICES */}

                <Route
                  path="/services"
                  element={<Services />}
                />

                <Route
                  path="/services/add"
                  element={<AddService />}
                />

                <Route
                  path="/services/edit/:id"
                  element={<AddService />}
                />


                {/* BOOKINGS */}

                <Route
                  path="/bookings"
                  element={<Bookings />}
                />


                {/* COMMENTS */}

                <Route
                  path="/comments"
                  element={<Comments />}
                />


                {/* ENQUIRIES */}

                <Route
                  path="/enquiries"
                  element={<AdminContacts />}
                />


                {/* TESTIMONIALS */}

                <Route
                  path="/testimonials"
                  element={
                    <TestimonialsAdmin />
                  }
                />

                <Route
                  path="/testimonials/add"
                  element={
                    <TestimonialForm />
                  }
                />

                <Route
                  path="/testimonials/edit/:id"
                  element={
                    <TestimonialForm />
                  }
                />

                <Route
                  path="/testimonials/settings"
                  element={
                    <TestimonialsSettings />
                  }
                />


                {/* HIGHLIGHTS */}

                <Route
                  path="/highlights"
                  element={
                    <HighlightsAdmin />
                  }
                />

                <Route
                  path="/highlights/add"
                  element={
                    <HighlightForm />
                  }
                />

                <Route
                  path="/highlights/edit/:id"
                  element={
                    <HighlightForm />
                  }
                />


                {/* FAQS */}

                <Route
                  path="/faqs"
                  element={<FaqsAdmin />}
                />

                <Route
                  path="/faqs/add"
                  element={<FaqForm />}
                />

                <Route
                  path="/faqs/edit/:id"
                  element={<FaqForm />}
                />


                {/* ABOUT */}

                <Route
                  path="/about"
                  element={<AboutAdmin />}
                />

                <Route
                  path="/about/edit"
                  element={<AboutForm />}
                />


                {/* REVIEWS */}

                <Route
                  path="/reviews"
                  element={<ReviewsAdmin />}
                />

                <Route
                  path="/reviews/create"
                  element={<ReviewForm />}
                />

                <Route
                  path="/reviews/edit/:id"
                  element={<ReviewForm />}
                />


                {/* BLOGS */}

                <Route
                  path="/blogs"
                  element={<BlogsAdmin />}
                />

                <Route
                  path="/blogs/create"
                  element={<BlogForm />}
                />

                <Route
                  path="/blogs/edit/:id"
                  element={<BlogForm />}
                />


                {/* BLOG PAGE */}

                <Route
                  path="/blog-page/edit"
                  element={
                    <BlogPageForm />
                  }
                />
                <Route
  path="/admin/withdrawals"
  element={<AdminWithdrawals />}
/>
<Route
  path="/notifications"
  element={<Notifications />}
/>

              </Route>

            </Route>


            {/* =====================
                404
            ===================== */}

            <Route
              path="*"
              element={
                <div>
                  Page Not Found
                </div>
              }
            />


          </Routes>

        </BrowserRouter>

      </AuthProvider>

    </HelmetProvider>

  );

}


export default App;