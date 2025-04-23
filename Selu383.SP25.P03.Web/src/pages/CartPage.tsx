import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

import { cartService } from "../services/CartApi";
import { CartDto, CartItemDto, FoodCartItemDto } from "../Data/CartInterfaces";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";



const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsLoading, setItemsLoading] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [showGuestEmailInput, setShowGuestEmailInput] = useState(false);
  const [error, setError] = useState("");
  const isValidPassword = (pwd: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pwd);
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const { user, isAuthenticated } = useAuth();

  const FromQuery = searchParams.get('userId');
  const userId = userIdFromQuery ? parseInt(userIdFromQuery) : (user ? user.id : null);



  const formatDateTime = (isoString: string): string => {
    if (!isoString || isoString.startsWith('0001-01-01')) return '';
    
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      
      // Format: "Apr 26, 3:00 PM"
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return '';
    }
  };
  
  useEffect(() => {

    if (!isAuthenticated && !userIdFromQuery) {
      navigate('/login', { state: { returnUrl: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname, userIdFromQuery]);

  const fetchCart = async () => {
    if (!userId) {
      setError("User ID is missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartService.getCart(userId);
      setCart(cartData);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const getItemTotal = (item: CartItemDto) => item.totalPrice;

  const getFoodItemsTotal = () => {
    return cart?.foodItems?.reduce((acc: number, item: FoodCartItemDto) => acc + item.totalPrice, 0) || 0;
  };

  const getTicketsTotal = () => {
    return cart?.items.reduce((acc: number, item: CartItemDto) => acc + getItemTotal(item), 0) || 0;

  };

  const getCartTotal = () => {
    return getTicketsTotal() + getFoodItemsTotal();
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (!userId) {
      setError("User ID is missing. Please log in.");
      return;
    }

    try {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`ticket-${cartItemId}`] = true;
      setItemsLoading(newLoadingState);
      
      const updatedCart = await cartService.removeFromCart(userId, cartItemId);
      setCart(updatedCart);
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item from cart.");
    } finally {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`ticket-${cartItemId}`] = false;
      setItemsLoading(newLoadingState);
    }
  };

  const handleRemoveFoodItem = async (foodCartItemId: number) => {
    if (!userId) {
      setError("User ID is missing. Please log in.");
      return;
    }

    try {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`food-${foodCartItemId}`] = true;
      setItemsLoading(newLoadingState);
      
      const updatedCart = await cartService.removeFoodFromCart(userId, foodCartItemId);
      setCart(updatedCart);
    } catch (err) {
      console.error("Error removing food item:", err);
      setError("Failed to remove food item from cart.");
    } finally {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`food-${foodCartItemId}`] = false;
      setItemsLoading(newLoadingState);
    }
  };


  const handleClearCart = async () => {
    if (!userId) {
      setError("User ID is missing. Please log in.");
    }

  const handleCheckout = async () => {
    setError("");

    if (!isAuthenticated) {
      if (!guestEmail || !guestPassword) {
        setShowGuestEmailInput(true);
        setError("Email and password are required.");
        return;
      }

      if (!isValidEmail(guestEmail)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (!isValidPassword(guestPassword)) {
        setError("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
        return;
      }

    }

    try {
      setLoading(true);
<
      await cartService.clearCart(userId);
      setCart({
        id: cart?.id || 0,
        userId: userId,
        items: [],
        foodItems: []
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart.");

      for (const order of cartList) {
        const { showtime, selectedSeats } = order;

        for (const seat of selectedSeats) {
          const res = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              showtimeId: showtime.id,
              seatNumber: seat,
              ticketType: "Standard",
              email: isAuthenticated ? undefined : guestEmail,
              password: isAuthenticated ? undefined : guestPassword,
            }),
          });

          if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(`Failed to book seat ${seat}: ${errorMsg}`);
          }
        }
      }

      const services: any[] = [];

      for (const order of cartList) {
        const { showtime, selectedSeats, foodCart } = order;

        for (const seat of selectedSeats) {
          services.push({
            name: `${showtime.movieTitle} - Seat ${seat}`,
            price: Math.round(showtime.price * 100)
          });
        }

        Object.values(foodCart || {}).forEach((foodItem: any) => {
          services.push({
            name: foodItem.foodItem.name,
            price: Math.round(foodItem.foodItem.price * foodItem.quantity * 100),
          });
        });
      }

      if (services.length === 0) {
        localStorage.removeItem("orderCart");
        alert("Tickets booked successfully!");
        navigate("/confirmation");
        return;
      }

      const { publicKey } = await fetch("/api/payments/public-key").then((res) => res.json());
      const stripe = await loadStripe(publicKey);

      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      });

      const { sessionId } = await response.json();
      if (!sessionId) throw new Error("Stripe session not created");

      localStorage.removeItem("orderCart");
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      alert(error.message || "Checkout failed. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black min-h-screen text-white py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-center">Your Cart</h1>

        {(!cart || (cart.items.length === 0 && (cart.foodItems || []).length === 0)) ? (
          <div className="text-center py-10 bg-gray-900 rounded-xl">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty.</p>
            <button 
              onClick={() => navigate("/")} 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>

            {/* Ticket Items */}
            {cart.items && cart.items.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Tickets</h2>
                {cart.items.map((item, idx) => (
                  <div key={`ticket-${idx}`} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-2 mb-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                      <div className="flex items-center space-x-4">
              {item.showtimeDetails.moviePoster && (
                <img
                  src={item.showtimeDetails.moviePoster}
                  alt={item.showtimeDetails.movieTitle}
                  className="w-20 h-28 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-bold">{item.showtimeDetails.movieTitle}</h3>
                {/* Rendering showtime details (fix this to access specific properties) */}
                <p className="text-sm text-gray-400">
                  {formatDateTime(item.showtimeDetails?.startTime)} 
                </p>
                <p className="text-sm text-gray-400">
  Hall: <span className="text-yellow-400 font-semibold">{item.showtimeDetails.hallNumber}</span>
</p>
<p className="text-sm text-gray-400">
  Seats: <span className="text-yellow-400 font-semibold">{item.selectedSeats}</span>
</p>
              </div>
            </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${item.totalPrice.toFixed(2)}</p>
                        <button 
                          onClick={() => handleRemoveItem(item.id)} 
                          className="text-red-500 hover:text-red-700 mt-2 flex items-center gap-1"
                          disabled={itemsLoading[`ticket-${item.id}`]}
                        >
                          {itemsLoading[`ticket-${item.id}`] ? 'Removing...' : (
                            <>
                              <FaTrashAlt className="w-4 h-4" /> Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Food Items */}
            {cart.foodItems && cart.foodItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Food & Drinks</h2>
                {cart.foodItems.map((item, idx) => (
                  <div key={`food-${idx}`} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-2 mb-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center space-x-4">
                      {item.foodImageUrl && (
                        <img src={item.foodImageUrl} alt={item.foodName} className="w-16 h-16 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.foodName}</h3>
                        <p className="text-sm text-gray-400">{item.foodDescription}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm">${item.unitPrice.toFixed(2)} × {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${item.totalPrice.toFixed(2)}</p>
                        <button 
                          onClick={() => handleRemoveFoodItem(item.id)} 
                          className="text-red-500 hover:text-red-700 mt-2 flex items-center gap-1"
                          disabled={itemsLoading[`food-${item.id}`]}
                        >
                          {itemsLoading[`food-${item.id}`] ? 'Removing...' : (
                            <>
                              <FaTrashAlt className="w-4 h-4" /> Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}
            
            {/* Cart Total */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
              <div className="space-y-2 border-b border-gray-700 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Tickets Subtotal:</span>
                  <span>${getTicketsTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Food & Drinks:</span>
                  <span>${getFoodItemsTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              {!isAuthenticated && showGuestEmailInput && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Guest Email</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Create Password</label>
                    <input
                      type="password"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm pt-1">{error}</p>}
                </div>
              )}
            </div>


            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between mt-4 gap-4">
              <button
                onClick={handleClearCart}
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
                disabled={loading}
              >
                {loading ? 'Clearing...' : 'Clear Cart'}
              </button>
              <button
                onClick={() => navigate("/checkout", { state: { userId } })}
                className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 rounded-lg font-semibold"
                disabled={loading}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCheckout}
                className={`bg-green-600 text-white hover:bg-green-700 px-8 py-4 rounded-lg font-semibold ${
                  loading || (!isAuthenticated && showGuestEmailInput && (!guestEmail.includes("@") || guestPassword.length < 6))
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={loading || (!isAuthenticated && showGuestEmailInput && (!guestEmail.includes("@") || guestPassword.length < 6))}

              >
                {loading ? "Processing..." : "Complete Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;