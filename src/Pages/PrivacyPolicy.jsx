import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-(--text)">

      <h1 className="text-3xl font-bold text-(--primary) mb-6">
        Privacy Policy
      </h1>

      {/* Data Collection */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>

        <ul className="list-disc pl-5 text-(--text-secondary) space-y-2">
          <li>User name, email, password (encrypted)</li>
          <li>Profile photo (upload or URL)</li>
          <li>Google authentication data (if used)</li>
          <li>Project, task, and team activity data</li>
          <li>Last active time and usage tracking</li>
        </ul>
      </section>

      {/* Usage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Data</h2>

        <ul className="list-disc pl-5 text-(--text-secondary) space-y-2">
          <li>To provide team collaboration features</li>
          <li>To manage projects and tasks</li>
          <li>To send notifications and emails</li>
          <li>To improve system performance and security</li>
        </ul>
      </section>

      {/* Sharing */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>

        <p className="text-(--text-secondary)">
          We do not sell or share personal data with third parties.
          Data is only shared within your team and system roles (Manager, Admin, Member)
          based on permissions.
        </p>
      </section>

      {/* Security */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>

        <ul className="list-disc pl-5 text-(--text-secondary) space-y-2">
          <li>JWT authentication for secure API access</li>
          <li>Role-based access control system</li>
          <li>Blocked user restriction system</li>
          <li>Encrypted password storage</li>
        </ul>
      </section>

      {/* User Rights */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. User Rights</h2>

        <ul className="list-disc pl-5 text-(--text-secondary) space-y-2">
          <li>User can update profile anytime</li>
          <li>User can delete account (if allowed by system rules)</li>
          <li>User can manage notifications and preferences</li>
        </ul>
      </section>

      {/* Updates */}
      <section>
        <h2 className="text-xl font-semibold mb-2">6. Policy Updates</h2>

        <p className="text-(--text-secondary)">
          We may update this Privacy Policy when new features like pricing,
          notifications, or analytics are added. Users will be notified in such cases.
        </p>
      </section>

    </div>
  );
};

export default PrivacyPolicy;