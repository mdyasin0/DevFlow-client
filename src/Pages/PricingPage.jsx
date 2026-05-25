import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function PricingPage() {
  const email = "mdy614020@gmail.com";

  const [loadingFree, setLoadingFree] = useState(false);
  const [loadingPremium, setLoadingPremium] = useState(false);
const handleUpgradePremium = async () => {
  try {
    setLoadingPremium(true);

    // 🔥 STEP 1: Check plan first
    const checkRes = await fetch(
      `http://localhost:5000/plan/check/${email}`
    );

    const checkData = await checkRes.json();

    // 🔥 STEP 2: যদি already premium হয়
    if (checkData.isPremium) {
      const confirmAgain = window.confirm(
        `You are already in Premium plan.\nRemaining Days: ${checkData.remainingDays}\n\nDo you want to take premium again?`
      );

      if (!confirmAgain) {
        return;
      }
    }

    // 🔥 STEP 3: Continue normal process
    const res = await fetch(
      `http://localhost:5000/plan/upgrade-premium/${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed");
      return;
    }

    window.location.href = data.url;

  } catch (err) {
    alert("Something went wrong");
  } finally {
    setLoadingPremium(false);
  }
};
  // 🔥 FREE HANDLER
 const handleStartFree = async () => {
  try {
    setLoadingFree(true);

    // 🔥 STEP 1: Check current plan
    const resCheck = await fetch(
      `http://localhost:5000/plan/check/${email}`
    );

    const dataCheck = await resCheck.json();

    // 🔥 CASE 1: Already free
    if (!dataCheck.isPremium && dataCheck.remainingDays === undefined) {
      alert("You are already in Free plan");
      return;
    }

    // 🔥 CASE 2: Premium user
    if (dataCheck.isPremium) {
      const confirm = window.confirm(
        `You are currently in PREMIUM plan.\nRemaining Days: ${dataCheck.remainingDays}\n\nDo you want to downgrade to FREE?`
      );

      if (!confirm) return;
    }

    // 🔥 STEP 2: Call backend
    const res = await fetch(
      `http://localhost:5000/plan/start-free/${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed");
      return;
    }

    alert(data.message);

  } catch {
    alert("Something went wrong");
  } finally {
    setLoadingFree(false);
  }
};



  return (
    <div className="min-h-screen p-6"
      style={{
        background: "linear-gradient(to bottom right, var(--bg), var(--bg-secondary))",
        color: "var(--text)",
      }}
    >

      {/* HERO */}
      <div className="text-center mb-12">
        <p style={{ color: "var(--text-secondary)" }}>
          Start free and upgrade when your team grows 🚀
        </p>
      </div>

      {/* PLANS */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* FREE */}
       <motion.div
  whileHover={{ scale: 1.05 }}
  className="p-6 rounded-2xl border  shadow-lg  flex flex-col"
  style={{
    background: "var(--card)",
    borderColor: "var(--border)",
  }}
>
  <h2 className="text-2xl font-semibold mt-4">
    Free (Starter)
  </h2>

  <h3 className="text-3xl font-bold mb-6">$0 /month</h3>

  {/* 🔥 FEATURES LIST */}
<ul className="space-y-2 mb-6 text-sm grow">
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> 1 Project only
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Max 5 Team Members
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> 20 Invitations
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Task System: Todo / Running / Done
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Task Limit: 50 per project
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Task Character Limit: 500
  </li>

  <li className="flex items-center gap-2">
    <FaTimesCircle className="text-red-500" /> No File Upload
  </li>
  <li className="flex items-center gap-2">
    <FaTimesCircle className="text-red-500" /> No Discussion System
  </li>
  <li className="flex items-center gap-2">
    <FaTimesCircle className="text-red-500" /> No Deadline Reminder
  </li>
  <li className="flex items-center gap-2">
    <FaTimesCircle className="text-red-500" /> No Analytics / Charts
  </li>
  <li className="flex items-center gap-2">
    <FaTimesCircle className="text-red-500" /> No Performance Tracking
  </li>
</ul>

  <button
    disabled={loadingFree}
    onClick={handleStartFree}
    className="w-full py-2 rounded-xl"
    style={{
      background: "#6b7280",
      color: "#fff",
    }}
  >
    {loadingFree ? "Processing..." : "Start Free"}
  </button>
</motion.div>

        {/* PREMIUM */}
      <motion.div
  whileHover={{ scale: 1.05 }}
  className="p-6 rounded-2xl border shadow-lg flex flex-col"
  style={{
    background: "var(--card)",
    borderColor: "var(--primary)",
  }}
>
  <span
    className="text-xs px-3 py-1 max-w-24 rounded-full"
    style={{ background: "var(--primary)", color: "#fff" }}
  >
    Most Popular
  </span>

  <h2 className="text-2xl font-semibold mt-4">
    Premium
  </h2>

  <h3 className="text-3xl font-bold mb-6">
    $9 /month
  </h3>

  {/* 🔥 FEATURES LIST */}
<ul className="mb-6 space-y-2 text-sm grow">
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Unlimited Projects
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Unlimited Team Members
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Unlimited Invitations
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Task Reopen System
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Task Delete
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Project Discussion System
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Member Remove / Control
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Deadline Reminder (Email + Notification)
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Task Status Analytics
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Performance Tracking
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Team Member Ranking
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Unlimited Tasks
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> Unlimited Task Characters
  </li>
  <li className="flex items-center gap-2">
    <FaCheckCircle className="text-green-500" /> File Attachment (20MB)
  </li>
</ul>

  <button
    disabled={loadingPremium}
    onClick={handleUpgradePremium}
    className="w-full py-2 rounded-xl"
    style={{
      background: "var(--primary)",
      color: "#fff",
    }}
  >
    {loadingPremium ? "Processing..." : "Upgrade to Premium"}
  </button>
</motion.div>

      </div>
    </div>
  );
}