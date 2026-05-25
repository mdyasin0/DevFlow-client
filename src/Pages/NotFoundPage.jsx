import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md"
      >

        {/* Sad emoji animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-7xl mb-4"
        >
          😢
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-5xl font-bold text-gray-800">
          404
        </h1>

        <h2 className="text-xl font-semibold text-gray-600 mt-2">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-500 mt-4">
          There is nothing like you want 😔
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-gray-900 transition"
        >
          Go to home
        </motion.button>

      </motion.div>
    </div>
  );
}