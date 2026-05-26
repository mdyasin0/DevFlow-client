import { useEffect, useState, useRef } from "react";
import { BiBarChart, BiBell, BiFolder, BiSearch, BiTargetLock } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import { CgLock } from "react-icons/cg";
import { FaUserSecret } from "react-icons/fa";
import { GiLightBulb } from "react-icons/gi";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "auth", title: "Login , profile and bloacked" },
  { id: "project", title: "Project Management" },
  { id: "teammember", title: "as a team member" },
  { id: "pricing", title: "Pricing" },
];

export default function DocumentationPage() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(sections);
  const [active, setActive] = useState("introduction");
  const [open, setOpen] = useState(false);

  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const contentRef = useRef(null);

  // 🔥 FIXED: scroll detection on content div (not window)
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleScroll = () => {
      const currentScrollY = el.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }

      setLastScrollY(currentScrollY);
    };

    el.addEventListener("scroll", handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setFiltered(
      sections.filter((sec) =>
        sec.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-(--bg) text-(--text)">

      {/* Mobile Top Bar */}
      <div
        className={`
          md:hidden flex items-center justify-between p-4 border-b border-(--border) bg-(--bg-secondary)
          fixed top-0 left-0 w-full z-50
          transition-transform duration-300
          ${showTopBar ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <h2 className="text-xl font-bold">📘 Docs</h2>

        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-1 border rounded"
        >
          ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full md:h-screen w-72
          border-r border-(--border) p-4 overflow-y-auto
          bg-(--bg-secondary) transition-transform duration-300
          z-40  md:top-0

          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <h2 className="text-xl font-bold mb-4 hidden md:block">📘 Docs</h2>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-2 rounded-lg border bg-(--card)"
        />

        <ul className="space-y-2">
          {filtered.map((sec) => (
            <li
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`cursor-pointer p-2 rounded transition 
                ${
                  active === sec.id
                    ? "bg-(--primary) text-white"
                    : "hover:bg-(--border)"
                }`}
            >
              {sec.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Content (IMPORTANT FIX HERE) */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto h-screen p-4 md:p-8 space-y-16 pt-16 md:pt-0"
      >

       <Section id="introduction" title="Introduction">
  <p>
    This website is a modern Project & Team Management System,
    which allows you to easily plan projects, manage tasks, and collaborate
    with your team.
  </p>

  <br />

  <h3 className="text-xl font-semibold">
    <BiSearch className="inline w-5 h-5 mr-1" /> What is it?
  </h3>
  <ul className="list-disc ml-6">
    <li>You can create your own projects</li>
    <li>You can add team members and work together</li>
    <li>You can assign, track, and complete tasks</li>
    <li>You can see your team's progress in real time</li>
  </ul>

  <p className="mt-3">
    This is your digital workspace, where your entire team can work in an organized way.
  </p>

  <br />

  <h3 className="text-xl font-semibold">
    <BsQuestionCircle className="inline w-5 h-5 mr-1" /> Why use it?
  </h3>
  <ul className="list-disc ml-6">
    <li>It is hard to understand who is doing which task</li>
    <li>Deadlines are often missed</li>
    <li>Communication is not clear</li>
  </ul>

  <p className="mt-3">
    This system has been built to solve these problems.
  </p>

  <ul className="list-disc ml-6 mt-2">
    <li>You can manage all tasks in one place</li>
    <li>You can easily track team members' work</li>
    <li>You can maintain deadlines</li>
    <li>You can maintain a smooth workflow</li>
  </ul>

  <br />

  <h3 className="text-xl font-semibold">
    <GiLightBulb className="inline w-5 h-5 mr-1" /> How it helps you?
  </h3>

  <p>
    <b><BiFolder className="inline w-4 h-4 mr-1" /> Organized Workflow:</b> Everything will be in one place
  </p>
  <p>
    <b><FaUserSecret className="inline w-4 h-4 mr-1" /> Collaboration:</b> Real-time work can be done
  </p>
  <p>
    <b><CgLock className="inline w-4 h-4 mr-1" /> Time Management:</b> Deadline tracking becomes easy
  </p>
  <p>
    <b><BiBarChart className="inline w-4 h-4 mr-1" /> Insight:</b> Performance can be analyzed
  </p>
  <p>
    <b><BiBell className="inline w-4 h-4 mr-1" /> Notification:</b> All updates are received instantly
  </p>

  <br />

  <h3 className="text-xl font-semibold">
    <BiTargetLock className="inline w-5 h-5 mr-1" /> Summary
  </h3>
  <ul className="list-disc ml-6">
    <li>You can manage teams</li>
    <li>You can track project progress</li>
    <li>Work efficiency will improve</li>
  </ul>
</Section>

       <Section id="auth" title="Login , Register and Profile">
  <p>
    In order to use this system, every user must first log in. <br />
    For login, users can use either a Google account or email and password. <br />
    Users will be able to update their name and profile picture. <br />
    Any blocked user will not be able to use this website. <br />
    A user will only be blocked when they violate the website rules or regulations.
  </p>
</Section>

      <Section id="project" title="Project Management">
  <p>
    A user will be able to create a project.<br />
    After creating a project, that user will become the project manager.<br />
    In this system there is a premium (plan) system, where only the manager needs to purchase the premium plan.<br />
    If the premium is active, all team members can use all premium features.<br />
    That means the plan is fully manager-based, not individual user-based.<br /><br />

    The manager can update project data (title, team name, description) and delete the project.<br />
    Only the manager can invite team members.<br />
    No other user can invite team members.<br /><br />

    The manager can delete pending and rejected invitations and resend invites if needed.<br /><br />

    All analytics of project progress and team member ranking system can only be viewed by the manager.<br /><br />

    The manager can assign tasks to team members, update tasks, delete tasks, and reopen tasks.<br />
    When a task is reopened, a completed task will go back to running state and the submit time will be removed.<br />
    When marked done again, a new submit time will be set.<br /><br />

    The manager can remove any team member from the project.<br /><br />

    The manager can see all members' tasks.<br /><br />

    Any manager action such as:<br />
    - project update<br />
    - project delete<br />
    - member remove<br />
    - invitation send<br /><br />

    In all these cases, notifications will be sent to affected users.<br />
    That means users who were invited or users affected by any project/account changes will receive a notification that the manager has performed an action related to the project or their account.
  </p>
</Section>

      <Section id="teammember" title="as a team member">
  <p>
    A user must receive an invitation from the team manager in order to join a team, <br />
    otherwise they cannot join that team. <br /><br />

    If they accept the invitation, then they will become an active member of that team <br />
    and will be able to fully collaborate with the team. <br /><br />

    They will get all benefits and access related to that team, such as: <br />
    - If the manager is premium, they can use premium access <br />
    - They will receive team-related notifications <br />
    - They can participate in the team discussion system <br />
    - If the manager assigns any task, they will receive it and can update its status <br />
    - They will receive notifications when deadlines are approaching <br /><br />

    In this way, an invited user can fully join the team and work together, using the collaboration system.
  </p>
</Section>

        

<Section id="pricing" title="Pricing">
  <p>
    Our system’s pricing or plan structure is designed based on a manager. <br />
    That means all members of a team do not need to pay for separate plans. <br />
    Instead, only the manager will pay for the plan, and then automatically all members of that team will be able to use the premium features.
  </p>
</Section>

      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-3xl font-bold mb-3">{title}</h2>
      <div className="text-(--text-secondary) leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}