import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Theater } from "../services/api";
import { theaterService } from "../services/api";
import { FaMapMarkerAlt, FaFilm, FaStar } from "react-icons/fa";
import { useTheater } from "../context/TheaterContext";
import { motion } from "framer-motion";

const TheatersPage = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [cityFilter, setCityFilter] = useState("");
  const { setTheater } = useTheater();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await theaterService.getAll();
        setTheaters(res);
      } catch (err) {
        console.error("Failed to load theaters", err);
      }
    };

    fetchTheaters();
  }, []);

  const filteredTheaters = cityFilter
    ? theaters.filter((t) => t.address.toLowerCase().includes(cityFilter.toLowerCase()))
    : theaters;

  return (
    <div className="relative p-8 max-w-6xl mx-auto text-white">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">🎭 Our Theaters</h1>
        <p className="text-gray-400 mt-2 text-lg">Explore locations & pick your favorite 🦁</p>

        {/* Filter input */}
        <input
          type="text"
          placeholder="Filter by city..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="mt-6 px-4 py-2 rounded-md text-white placeholder-gray-400 bg-gray-800 w-64 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md transition"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredTheaters.map((theater, idx) => (
          <motion.div
            key={theater.id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="relative bg-black/30 backdrop-blur-md border border-red-600 shadow-lg text-white rounded-3xl p-6 flex flex-col gap-4 hover:shadow-red-500/50 transition-all"
          >
            {idx === 0 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-red-500 text-black px-3 py-1 text-sm rounded-full font-bold shadow-md">
                🔥 Featured
              </div>
            )}

            <div className="flex items-center gap-2 text-2xl font-bold">
              <FaFilm className="text-red-500" />
              <h2>{theater.name}</h2>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <FaMapMarkerAlt className="text-red-400" />
              <span>{theater.address}</span>
            </div>
            
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              {[...Array(4)].map((_, i) => <FaStar key={i} />)}
              <FaStar className="text-gray-600" />
              <span className="ml-1 text-gray-400">(4.0)</span>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-red-500/40 transition"
                onClick={() => {
                  setTheater(theater);
                  navigate("/discover-movies");
                }}
              >
                🎯 View Movies
              </button>
              <button
                className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-blue-500/40 transition"
                onClick={() => navigate(`/theaters/${theater.id}/reviews?theaterId=${theater.id}`)} // Pass theaterId in the query string
              >
                📝 View Reviews
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TheatersPage;
