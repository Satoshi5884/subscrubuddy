import { Home, Calendar, BarChart2, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function MainNav() {
  const location = useLocation();
  
  const links = [
    { href: "/dashboard", label: "ダッシュボード", icon: Home },
    { href: "/calendar", label: "カレンダー", icon: Calendar },
    { href: "/subscriptions", label: "サブスクリプション", icon: BarChart2 },
    { href: "/settings", label: "設定", icon: Settings },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.href;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}