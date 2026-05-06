import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      
      <h1 className="text-6xl font-bold text-red-500">403</h1>

      <h2 className="text-2xl font-semibold mt-4 text-gray-800">
        Access Denied
      </h2>

      <p className="text-gray-600 mt-2 text-center max-w-md">
        আপনি এই page-এ access করার permission নেই। দয়া করে সঠিক role দিয়ে login করুন বা admin এর সাথে যোগাযোগ করুন।
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to="/"
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Go Home
        </Link>

        <Link
          to="/login"
          className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;