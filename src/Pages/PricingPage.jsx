import { motion } from "framer-motion";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "For individuals & small teams",
      features: [
        "1 Project",
        "Max 5 Team Members",
        "Basic Task Management",
        "Invite System",
        "Basic Analytics",
      ],
      highlight: false,
      button: "Start Free",
    },
    {
      name: "Pro",
      price: "$9",
      desc: "For growing teams",
      features: [
        "Unlimited Projects",
        "Up to 20 Members",
        "Advanced Analytics",
        "Full Email System",
        "Real-time Updates",
        "Notifications",
      ],
      highlight: true,
      button: "Upgrade to Pro",
    },
    {
      name: "Business",
      price: "$29",
      desc: "For startups & companies",
      features: [
        "Unlimited Projects",
        "Unlimited Members",
        "Full Admin Panel",
        "Advanced Ranking System",
        "AI Task Insights (Coming Soon)",
      ],
      highlight: false,
      button: "Get Started",
    },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(to bottom right, var(--bg), var(--bg-secondary))",
        color: "var(--text)",
      }}
    >
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Start free, scale as your team grows with DevFlow
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                <li
                  key={i}
                  style={{ color: "var(--text-secondary)" }}
                >
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
            <h3 className="font-semibold">Is DevFlow free?</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Yes, with limitations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Can I upgrade later?</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Yes, anytime.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Is my data secure?</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Yes, we use secure authentication systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}