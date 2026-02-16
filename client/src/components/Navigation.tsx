import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, MessageSquare, FileText, Briefcase, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: User },
    { href: "/fit", label: "Evaluate", icon: MessageSquare },
    { href: "/case-study", label: "Case Study", icon: BookOpen },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto border-t md:border-t-0 md:border-b border-surface-line/30 bg-surface-ink/95 backdrop-blur-md px-4 py-2 md:py-4 shadow-lg md:shadow-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="hidden md:flex items-center gap-3 cursor-pointer group">
            <img
              src="/CalumHeadshot.png"
              alt="Calum Kershaw"
              className="w-11 h-11 rounded-full object-cover ring-1 ring-inset ring-surface-paper/15 shadow-[0_10px_30px_rgba(15,23,42,0.35)]"
              draggable={false}
              loading="lazy"
            />
            <span className="text-xl font-bold font-display tracking-tight text-brand-red group-hover:text-brand-red/90 transition-colors">
              Calum Kershaw
            </span>
          </div>
        </Link>


        <ul className="flex w-full md:w-auto justify-between md:gap-1">
          {navItems.map((item) => {
            // Check if current location matches or starts with the href (for nested routes like /fit/chat)
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
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

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          <Link href="/fit">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-surface-paper/30 text-surface-paper hover:bg-surface-paper/10 hover:border-surface-paper/50"
            >
              Use Evaluation Tool
            </Button>
          </Link>
          <ContactDialog>
            <Button
              size="sm"
              className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-surface-paper"
            >
              Contact
            </Button>
          </ContactDialog>
        </div>
      </div>
    </nav>
  );
}
