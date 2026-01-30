import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, MessageSquare, FileText, Briefcase, BookOpen } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/fit", label: "Fit Check", icon: MessageSquare },
    { href: "/case-study", label: "Case Study", icon: BookOpen },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto border-t md:border-t-0 md:border-b border-surface-line/30 bg-surface-ink/95 backdrop-blur-md px-4 py-2 md:py-4 shadow-lg md:shadow-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <span className="hidden md:block text-xl font-bold font-display tracking-tight text-brand-red hover:text-brand-red/90 transition-colors cursor-pointer">
            Calum Kershaw
          </span>
        </Link>

        <ul className="flex w-full md:w-auto justify-between md:gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "text-surface-paper font-semibold bg-brand-copper/20"
                      : "text-brand-stone hover:text-surface-paper hover:bg-surface-paper/10"
                  )}
                >
                  <Icon className={cn("w-5 h-5 md:w-4 md:h-4", isActive && "text-brand-copper")} />
                  <span className="text-[10px] md:text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
