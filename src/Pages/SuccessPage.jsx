import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h1 className="text-2xl font-bold text-green-600">
          Welcome to Premium Plan!
        </h1>

        <p className="text-gray-600 mt-3">
          Now enjoy full features without any limit 🚀
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
          >
            Go to home
          </button>
        </div>
      </motion.div>
    </div>
  );
}