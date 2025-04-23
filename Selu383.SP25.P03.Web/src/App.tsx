import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { TheaterProvider } from "./context/TheaterContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import DiscoverMovies from "./pages/DiscoverMovies";
import FoodDrinks from "./pages/FoodDrinks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MovieDescriptionPage from "./pages/MovieDescription";
import SearchResults from "./pages/SearchResult";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminManageMovies from "./pages/Admin/AdminManageMovies";
import AdminAddMovie from "./pages/Admin/AdminAddMovie";
import AdminEditMovie from "./pages/Admin/AdminEditMovie";
import AdminManageTheaters from "./pages/Admin/AdminManageTheaters";
import AdminAddTheater from "./pages/Admin/AdminAddTheater";
import AdminEditTheater from "./pages/Admin/AdminEditTheater";
import TheaterGuard from "./Components/TheaterGuard"; // 🛡️ NEW GUARD
import ShowtimesPage from "./pages/ShowtimesPage";
import TheatersPage from "./pages/TheatersPage";
import SiteStats from "./pages/Admin/Graph/SiteStats";
import Payment from "./pages/Payment";
import "./index.css";
import CartPage from "./pages/CartPage";
import OrderSummary from "./pages/OrderSummary";
import ThankYouPage from "./pages/ThankYouPage";
import ReviewsPage from "./pages/ReviewsPage";


const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <TheaterProvider>
          <Router>
            <TheaterGuard> {/* ✅ Only render below after theater is ready */}
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="main-content flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/discover-movies" element={<DiscoverMovies />} />
                    <Route path="/food-drinks" element={<FoodDrinks />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/movie/:id" element={<MovieDescriptionPage />} />
                    <Route path="/movie-description/:movieName" element={<MovieDescriptionPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/showtimes/:movieId" element={<ShowtimesPage />} />
                    <Route path="/theaters" element={<TheatersPage />} />
                    <Route path="/orders" element={<OrderSummary/>} />
                    <Route path="/cart" element={<CartPage />}/>
                    <Route path="/payment" element={<Payment />}/>
                    <Route path="/thankyou" element={<ThankYouPage />} />
                    <Route path="/theaters/:id/reviews" element={<ReviewsPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/admin-users" element={<AdminUsers />} />
                    <Route path="/admin-manage-movies" element={<AdminManageMovies />} />
                    <Route path="/admin-add-movie" element={<AdminAddMovie />} />
                    <Route path="/admin/edit-movie/:id" element={<AdminEditMovie />} />
                    <Route path="/admin-manage-theaters" element={<AdminManageTheaters />} />
                    <Route path="/admin-add-theater" element={<AdminAddTheater />} />
                    <Route path="/admin/edit-theater/:id" element={<AdminEditTheater />} />
                    <Route path="/admin-site-stats" element={<SiteStats/>}/>
                    
                  </Routes>
                </main>
                <Footer />
              </div>
            </TheaterGuard>
          </Router>
        </TheaterProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
