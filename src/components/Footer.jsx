import React from "react";
import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-(--bg) border-t border-(--border)">

      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">

        {/* Brand */}
        <div>
          <h2 className="text-lg font-bold text-(--primary)">
            DevFlow
          </h2>

          <p className="text-sm mt-3 leading-relaxed text-(--text-secondary)">
            collaboration platform to manage projects, tasks,
            and teams in one unified workspace.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-semibold mb-3 text-(--text)">
            Product
          </h3>

          <ul className="space-y-2 text-sm">
        

            <li>
              <NavLink
                to="/pricingpage"
                className="text-(--text-secondary) hover:text-(--primary)"
              >
                Pricing
              </NavLink>
            </li>

          
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-3 text-(--text)">
            Legal
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <NavLink
                to="/rolesregulations"
                className="text-(--text-secondary) hover:text-(--primary)"
              >
                Roles & Regulations
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/privacypolicy"
                className="text-(--text-secondary) hover:text-(--primary)"
              >
                Privacy Policy
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/docs"
                className="text-(--text-secondary) hover:text-(--primary)"
              >
                Docs
              </NavLink>
            </li>
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