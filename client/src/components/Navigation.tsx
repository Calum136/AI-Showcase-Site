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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto border-t md:border-t-0 md:border-b border-surface-line/50 bg-surface-ink/95 backdrop-blur-md px-4 py-2 md:py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="hidden md:block text-xl font-bold font-display tracking-tight text-brand-red">
          <Link href="/">Calum Kershaw</Link>
        </div>

        <ul className="flex w-full md:w-auto justify-between md:gap-8">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 rounded-lg transition-colors duration-200",
                    isActive
                      ? "text-surface-paper font-semibold border-b-2 border-brand-copper"
                      : "text-brand-stone hover:text-surface-paper"
                  )}
                >
                  <Icon className={cn("w-5 h-5 md:w-4 md:h-4", isActive && "stroke-[2.5px]")} />
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
