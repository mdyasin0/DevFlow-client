import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function CancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md"
      >
        {/* Icon */}
        <div className="text-6xl mb-4">😔</div>

        <h1 className="text-2xl font-bold text-gray-700">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mt-3">
          You cancelled the payment.  
          If at any time you want, you can try again.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 text-white py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Go to home
          </button>

          <button
            onClick={() => navigate("/pricingpage")}
            className="border border-gray-500 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}