import { motion } from "framer-motion";

export default function PricingPage() {
  const plans = [
    {
      name: "Free (Starter)",
      price: "$0",
      desc: "For beginners & testing the platform",
      highlight: false,
      features: [
        "1 Project only",
        "Max 5 Team Members",
        "20 Invitations",
        "Task System: Todo / Running / Done",
        "Task Limit: 50 per project",
        "Task Character Limit: 500",
        "No File Upload",
        "No Discussion System",
        "No Deadline Reminder",
        "No Analytics / Charts",
        "No Performance Tracking",
        
      ],
      button: "Start Free",
    },

    {
      name: "Premium",
      price: "$9",
      desc: "For growing teams & professionals",
      highlight: true,
      features: [
        "Unlimited Projects",
        "Unlimited Team Members",
        "Unlimited Invitations",
        "Task Reopen System",
        "Task delete ",
        "Project Discussion System ",
        "Member Remove / Control",
        "Deadline Reminder (Email + Notification)",
        "Task Status Analytics ",
        "Performance Tracking (Late vs On-time)",
        "Team Member Ranking System ",
        "Unlimited Tasks per Project",
        "Unlimited Task Character Limit",
        " File Attachment (Max 20MB) ,Supports : Image, PDF, Docs, Zip, Video",
      ],
      button: "Upgrade to Premium",
    },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(to bottom right, var(--bg), var(--bg-secondary))",
        color: "var(--text)",
      }}
    >
      {/* Hero */}
      <div className="text-center mb-12">
     
        <p style={{ color: "var(--text-secondary)" }}>
          Start free and upgrade when your team grows 🚀
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl border shadow-lg"
            style={{
              background: "var(--card)",
              borderColor: plan.highlight
                ? "var(--primary)"
                : "var(--border)",
              boxShadow: `0 10px 25px var(--shadow)`,
            }}
          >
            {plan.highlight && (
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                }}
              >
                Most Popular
              </span>
            )}

            <h2 className="text-2xl font-semibold mt-4">{plan.name}</h2>

            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              {plan.desc}
            </p>

            <h3 className="text-3xl font-bold mb-6">
              {plan.price}
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                /month
              </span>
            </h3>

            <ul className="space-y-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} style={{ color: "var(--text-secondary)" }}>
                  ✔ {f}
                </li>
              ))}
            </ul>

            <button
              className="w-full py-2 rounded-xl transition"
              style={{
                background: "var(--primary)",
                color: "#fff",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "var(--primary-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "var(--primary)")
              }
            >
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">FAQ</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Can I upgrade later?</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Yes, anytime. Your data will be preserved.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Is Free plan really free?</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Yes, but it has limited features to encourage upgrading.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Is my data secure?</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Yes, we use JWT authentication and secure APIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}