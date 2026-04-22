import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="bg-(--bg) text-(--text)">

      {/*  Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Manage Projects Smarter with{" "}
            <span className="text-(--primary)">AI</span>
          </h1>

          <p className="mt-5 text-(--text-secondary)">
            DevFlow helps teams collaborate in real-time, manage tasks efficiently,
            and boost productivity using smart AI-powered tools.
          </p>

          <div className="mt-8 flex gap-4">

            <button className="px-6 py-3 bg-(--primary) text-white rounded-xl shadow hover:bg-(--primary-hover) transition">
              Get Started
            </button>

            <button className="px-6 py-3 border border-(--border) rounded-xl hover:bg-(--bg-secondary) transition">
              Live Demo
            </button>

          </div>
        </div>

        {/* Image */}
        <div className="bg-(--card) p-6 rounded-2xl shadow-lg border border-(--border)">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            alt="dashboard"
            className="rounded-xl"
          />
        </div>
      </section>

      {/*  Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">

        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            "AI Task Assistant",
            "Real-time Collaboration",
            "Kanban Board",
            "Analytics Dashboard",
            "Notifications",
            "Role-based Access",
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-(--card) border border-(--border) rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-2 text-(--primary)">
                {item}
              </h3>
              <p className="text-sm text-(--text-secondary)">
                Improve workflow and team productivity with advanced tools.
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* Analytics */}
      <section className="bg-(--bg-secondary) py-20 border-y border-(--border)">

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h2 className="text-3xl font-bold">
              Track Performance with Insights
            </h2>
            <p className="mt-4 text-(--text-secondary)">
              Visualize your team progress with powerful analytics and charts.
            </p>
          </div>

          <div className="bg-(--card) p-6 rounded-xl border border-(--border)">
            <div className="h-44 bg-(--primary)/20 rounded-lg"></div>
          </div>

        </div>
      </section>

      {/*  Collaboration */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">

        <div className="bg-(--card) p-6 rounded-xl border border-(--border)">
          <div className="h-44 bg-(--secondary)/30 rounded-lg"></div>
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            Collaborate in Real-time
          </h2>
          <p className="mt-4 text-(--text-secondary)">
            Stay connected with your team, comment instantly, and track every update.
          </p>
        </div>

      </section>

      {/*  CTA */}
      <section className="bg-(--primary) text-white text-center py-20">

        <h2 className="text-3xl font-bold">
          Start building with DevFlow today
        </h2>

        <p className="mt-4 opacity-90">
          Join teams who are boosting productivity with DevFlow.
        </p>

        <button className="mt-6 px-6 py-3 bg-white text-(--primary) font-semibold rounded-xl hover:opacity-90">
          Get Started
        </button>

      </section>

    </div>
  );
};

export default Home;