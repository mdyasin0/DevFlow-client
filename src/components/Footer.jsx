import React from "react";

const Footer = () => {
  return (
    <footer className="bg-(--bg) border-t border-(--border) mt-16">

      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-lg font-bold text-(--primary)">
            DevFlow
          </h2>

          <p className="text-sm mt-3 leading-relaxed text-(--text-secondary)">
            AI-powered collaboration platform to manage projects, tasks,
            and teams in one unified workspace.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-semibold mb-3 text-(--text)">
            Product
          </h3>

          <ul className="space-y-2 text-sm">
            {["Features", "Pricing", "Updates"].map((item, i) => (
              <li
                key={i}
                className="text-(--text-secondary) hover:text-(--primary) cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3 text-(--text)">
            Company
          </h3>

          <ul className="space-y-2 text-sm">
            {["About", "Careers", "Contact"].map((item, i) => (
              <li
                key={i}
                className="text-(--text-secondary) hover:text-(--primary) cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-3 text-(--text)">
            Social
          </h3>

          <ul className="space-y-2 text-sm">
            {["Twitter", "LinkedIn", "GitHub"].map((item, i) => (
              <li
                key={i}
                className="text-(--text-secondary) hover:text-(--primary) cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-(--border)">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-(--text-secondary)">
          © {new Date().getFullYear()}{" "}
          <span className="text-(--primary) font-medium">DevFlow</span>.
          All rights reserved.
        </div>
      </div>

    </footer>
  );
};

export default Footer;