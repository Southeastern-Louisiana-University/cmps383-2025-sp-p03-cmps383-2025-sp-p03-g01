import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Construct the ClientUri dynamically (for example, the current page URL or a predefined URL)
      const clientUri = window.location.origin; // or any other URI you want to send

      // API call for registration
      const response = await axios.post(
        "/api/users",
        {
          firstName,
          lastName,
          userName: username,
          email,
          password,
          roles: ["User"], // Default role, can be customized
          clientUri, // Add clientUri here
        },
        { withCredentials: true }
      );

      // Redirect to login after successful registration
      navigate("/login");
    } catch (err) {
      // Handle errors from the backend
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          setError("Registration failed. Please check the form and try again.");
        } else if (err.response?.data?.includes("Email is already taken")) {
          setError("Email is already in use. Please try another one.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md bg-black bg-opacity-70 backdrop-blur-md shadow-lg rounded-lg p-8 border border-gray-700">
        <div className="flex justify-center">
          <img src="/logos.png" alt="Logo" className="h-12 mb-4" />
        </div>

        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 transition-all py-2 mt-4 rounded-md text-white font-semibold"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-2 text-center text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-red-400 hover:text-red-500 transition"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
