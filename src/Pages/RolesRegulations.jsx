import React from "react";

const RolesRegulations = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-(--text)">
      <h1 className="text-3xl font-bold text-(--primary) mb-6">
        Roles & Regulations
      </h1>

      {/* System Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. System Overview</h2>
        <p className="text-(--text-secondary)">
          DevFlow is a collaboration platform where users can work as
          Developers, Managers, or Admins. Every role has specific permissions
          and limitations to ensure secure and structured teamwork.
        </p>
      </section>

      {/* Roles */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. User Roles</h2>

        <ul className="list-disc pl-5 text-(--text-secondary) space-y-2">
          <li>
            <b>Developer (Team Member):</b> Can join teams, work on assigned
            tasks, update task status, and participate in project discussions
            (based on plan).
          </li>

          <li>
            <b>Manager:</b> Can create projects, invite members, assign tasks,
            monitor progress, and manage team members.
          </li>

          <li>
            <b>Admin:</b> Full control over the platform including user
            management, project approval, analytics, email communication, and
            system monitoring.
          </li>
        </ul>
      </section>

      {/* Project Rules */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Project Regulations</h2>

        <ul className="list-disc pl-5 text-(--text-secondary) space-y-2">
          <li>Every project must be approved by Admin before activation.</li>
          <li>Only project owner (manager) can update or delete project.</li>
          <li>Team members can only access projects they are invited to.</li>
          <li>
            Unauthorized access is strictly restricted via JWT authentication.
          </li>
        </ul>
      </section>

      {/* Task Rules */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Task Rules</h2>

        <ul className="list-disc pl-5 text-(--text-secondary) space-y-2">
          <li>Tasks are assigned by managers only.</li>
          <li>Each task has status: Todo → Running → Done.</li>
          <li>Free plan users have task limitations.</li>
          <li>Deadline tracking are enabled for premium users.</li>
        </ul>
      </section>

      {/* Security */}
      <section>
        <h2 className="text-xl font-semibold mb-2">5. Security Rules</h2>

        <ul className="list-disc pl-5 text-(--text-secondary) space-y-2">
          <li>All APIs are protected with JWT authentication.</li>
          <li>Blocked users cannot access system after login attempt.</li>
          <li>Role-based access control is strictly enforced.</li>
          <li>Real-time updates use Socket.IO for secure sync.</li>
        </ul>
      </section>
    </div>
  );
};

export default RolesRegulations;
