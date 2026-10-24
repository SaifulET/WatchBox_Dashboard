import { Link, NavLink, Outlet } from "react-router-dom";
import appLogo from "../../assets/image/modevin-wordmark.png";

const navItems = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms and Conditions" },
  { to: "/contact", label: "Contact" },
  { to: "/account-deletion", label: "Delete Account" },
];

const PublicLayout = () => (
  <div className="min-h-screen bg-[#F7F8FA] text-[#0D1B2A] font-sans flex flex-col">
    <header className="bg-[#002B49] text-white">
      <div className="max-w-5xl mx-auto px-5 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/privacy-policy" className="inline-flex shrink-0 items-center gap-2.5">
          <img
            src={appLogo}
            alt="mywatchbox"
            className="h-14 w-14 rounded-full object-contain"
          />
          <span className="text-lg font-semibold tracking-wide">mywatchbox</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold uppercase tracking-wide">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-white" : "text-white/70 hover:text-white transition-colors"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>

    <main className="flex-1">
      <Outlet />
    </main>

    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-5 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[12px] text-gray-500">
        <p>© {new Date().getFullYear()} mywatchbox. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-[#002B49]">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  </div>
);

export default PublicLayout;
