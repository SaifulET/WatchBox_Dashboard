import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mainLogo from "../../assets/image/mainlogo.png";
import {
  LayoutGrid,
  Users,
  DollarSign,
  CreditCard,
  Store,
  LineChart,
  Activity,
  UserPlus,
  FileBarChart2,
  Mail,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Sidebar = ({ closeDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const permissions = useAuthStore((state) => state.permissions);
  const roles = useAuthStore((state) => state.roles);
  const loadPermissions = useAuthStore((state) => state.loadPermissions);
  const canReadSupport =
    permissions.includes("reports.read") ||
    roles.some((role) =>
      ["super-admin", "SUPER_ADMIN", "SUPPORT_ADMIN", "OPERATIONS_ADMIN"].includes(role)
    );

  useEffect(() => {
    loadPermissions().catch(() => {
      // Existing navigation remains usable if the permission refresh fails.
    });
  }, [loadPermissions]);

  const handleLogout = async () => {
    await logout();
    closeDrawer?.();
    navigate("/sign-in", { replace: true });
  };

  const menuItems = [
    {
      icon: <LayoutGrid className="w-[18px] h-[18px]" />,
      label: "Dashboard",
      Link: "/",
    },
    {
      icon: <Users className="w-[18px] h-[18px]" />,
      label: "Users",
      Link: "/users",
    },
    {
      icon: <DollarSign className="w-[18px] h-[18px]" />,
      label: "Earning",
      Link: "/earning",
    },
    {
      icon: <CreditCard className="w-[18px] h-[18px]" />,
      label: "Subscription",
      Link: "/subscription",
    },
    {
      icon: <Store className="w-[18px] h-[18px]" />,
      label: "Marketplaces",
      Link: "/marketplace",
    },
    {
      icon: <LineChart className="w-[18px] h-[18px]" />,
      label: "Analytics",
      Link: "/analytics",
    },
    {
      icon: <Activity className="w-[18px] h-[18px]" />,
      label: "System Monitoring",
      Link: "/system-monitoring",
    },
    {
      icon: <UserPlus className="w-[18px] h-[18px]" />,
      label: "Create Admin",
      Link: "/create-admin",
    },
    {
      icon: <FileBarChart2 className="w-[18px] h-[18px]" />,
      label: "Report",
      Link: "/reports",
    },
    {
      icon: <Mail className="w-[18px] h-[18px]" />,
      label: "Bulk Email",
      Link: "/bulk-email",
    },
    {
      icon: <MessageSquare className="w-[18px] h-[18px]" />,
      label: "Support Messages",
      Link: "/support",
      permission: "reports.read",
    },
    // {
    //   icon: <Sliders className="w-[18px] h-[18px]" />,
    //   label: "Configure",
    //   Link: "#",
    // },
    {
      icon: <Settings className="w-[18px] h-[18px]" />,
      label: "Settings",
      Link: "/settings",
    },
  ];

  return (
    <div className="w-full h-full bg-white border-r border-gray-100 flex flex-col justify-between font-sans">
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Top Header Logo space - Write bold logo */}
        <div className="px-6 py-8 flex flex-col items-center justify-center text-center select-none">
          <img src={mainLogo} alt="Modevin Logo" className="w-auto h-auto max-w-[150px] object-contain" />
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 select-none">
          {menuItems.filter((item) => !item.permission || (item.permission === "reports.read" && canReadSupport)).map((item) => {
            const isActive = location.pathname === item.Link || (item.Link === "/" && location.pathname === "/dashboard");

            return (
              <div key={item.label}>
                <Link
                  to={item.Link}
                  onClick={closeDrawer}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all ${isActive
                      ? "bg-[#002B49] text-white shadow-sm"
                      : "text-[#1C3D5A]/90 hover:bg-slate-50 hover:text-[#002B49]"
                    }`}
                >
                  <span className={isActive ? "text-white" : "text-[#1C3D5A]/70"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Log out */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center w-full gap-3.5 px-4 py-2.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50/50 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
