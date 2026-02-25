import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Palette,
  TrendingUp,
  Shield,
  DollarSign,
  Settings,
  LogOut,
  Sparkles,
  Bell,
  ChevronLeft,
  Menu,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Content Analyzer", icon: Search, path: "/dashboard/analyzer" },
  { label: "Content Studio", icon: Palette, path: "/dashboard/studio" },
  { label: "Trends & Calendar", icon: TrendingUp, path: "/dashboard/trends" },
  { label: "Safety & Copyright", icon: Shield, path: "/dashboard/safety" },
  { label: "Monetization", icon: DollarSign, path: "/dashboard/monetization" },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/analyzer": "Content Analyzer",
  "/dashboard/studio": "Content Studio",
  "/dashboard/trends": "Trends & Calendar",
  "/dashboard/safety": "Safety & Copyright",
  "/dashboard/monetization": "Monetization & Engagement",
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || "Dashboard";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary flex-shrink-0" />
        {sidebarOpen && (
          <span className="font-heading text-lg font-extrabold text-foreground">Creator Copilot</span>
        )}
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-green ml-auto flex-shrink-0" />
      </div>

      {/* Profile */}
      {sidebarOpen && (
        <div className="px-4 py-3 mx-3 rounded-lg bg-secondary mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-bold text-sm flex-shrink-0">
              K
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Kishore</p>
              <p className="text-xs text-muted-foreground truncate">@kishore</p>
            </div>
          </div>
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            Tech Creator
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1 border-t border-border pt-3 mt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <Settings className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen bg-card border-r border-border z-30 transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 h-full bg-card border-r border-border flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-16"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-muted-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-foreground">{pageTitle}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-muted-foreground">
              {getGreeting()}, <span className="text-foreground font-medium">Kishore</span> 👋
            </span>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-bold text-xs">
              K
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 page-transition">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-30">
        {navItems.slice(0, 5).map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
