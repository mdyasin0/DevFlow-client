import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaTasks, FaChartLine, FaShieldAlt } from "react-icons/fa";

const Home = () => {
  return (
    <div className="bg-(--bg) text-(--text) min-h-screen">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Manage Projects Smarter with{" "}
            <span className="text-(--primary)">DevFlow</span>
          </h1>

          <p className="mt-5 text-(--text-secondary)">
            A complete team collaboration platform with project management, task tracking,
            analytics, and role-based control — all in one place.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-(--primary) text-white rounded-xl shadow hover:bg-(--primary-hover) transition">
              Get Started
            </button>
            <button className="px-6 py-3 border border-(--border) rounded-xl hover:bg-(--bg-secondary) transition">
              View Demo
            </button>
          </div>
        </div>

        <div className="bg-(--card) p-6 rounded-2xl shadow border border-(--border)">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            alt="dashboard"
            className="rounded-xl w-full"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-4 gap-6 text-center">
        {[
          { label: "Users", value: "1K+" },
          { label: "Projects", value: "500+" },
          { label: "Tasks Completed", value: "10K+" },
          { label: "Teams", value: "200+" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-(--card) p-6 rounded-xl border border-(--border) shadow-sm"
          >
            <h3 className="text-2xl font-bold text-(--primary)">
              {item.value}
            </h3>
            <p className="text-(--text-secondary)">{item.label}</p>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Core Features
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: <FaTasks />, title: "Task Management" },
            { icon: <FaUsers />, title: "Team Collaboration" },
            { icon: <FaChartLine />, title: "Analytics Dashboard" },
            { icon: <FaShieldAlt />, title: "Role-based Access" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-(--card) border border-(--border) rounded-xl text-center shadow-sm"
            >
              <div className="text-3xl text-(--primary) mb-3 flex justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-(--bg-secondary) py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              "Create Project",
              "Invite Team Members",
              "Assign & Track Tasks",
            ].map((step, i) => (
              <div
                key={i}
                className="bg-(--card) p-6 rounded-xl border border-(--border) shadow-sm"
              >
                <h3 className="font-bold text-lg text-(--primary)">
                  Step {i + 1}
                </h3>
                <p className="mt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold">
            Analytics & Performance
          </h2>
          <p className="mt-4 text-(--text-secondary)">
            Track task completion, team performance, and productivity insights using charts.
          </p>
        </div>

        <div className="bg-(--card) p-6 rounded-xl border border-(--border) shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            alt="analytics dashboard"
            className="rounded-xl w-full"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-(--primary) text-white text-center py-20">
        <h2 className="text-3xl font-bold">
          Start Managing Your Team Today
        </h2>
        <p className="mt-4">
          Boost productivity and simplify workflows.
        </p>
        <button className="mt-6 px-6 py-3 bg-white text-(--primary) rounded-xl font-semibold hover:opacity-90 transition">
          Get Started
        </button>
      </section>

    </div>
  );
};

export default Home;