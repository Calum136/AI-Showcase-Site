import { Link } from "wouter";
import { Mail, Phone, Linkedin, Github, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-ink text-brand-stone py-6 mt-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Compact CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-5 mb-5 border-b border-white/10">
          <p className="text-sm text-surface-paper/80">
            Ready to evaluate fit? Let's talk.
          </p>
          <div className="flex gap-2">
            <ContactDialog>
              <Button
                size="sm"
                className="rounded-lg bg-brand-copper hover:bg-brand-copper/90 text-surface-paper text-xs h-8 px-4"
              >
                Contact Me <ArrowRight className="ml-1.5 w-3 h-3" />
              </Button>
            </ContactDialog>
            <Link href="/fit">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-surface-paper/30 text-surface-paper hover:bg-surface-paper/10 text-xs h-8 px-4"
              >
                Evaluate Tool
              </Button>
            </Link>
          </div>
        </div>

        {/* Three columns — tight */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          {/* Branding + Quick Links combined */}
          <div>
            <h3 className="text-brand-red font-bold text-sm mb-1">Calum Kershaw</h3>
            <p className="text-surface-line text-xs mb-3">AI Solutions Developer</p>
            <nav className="flex flex-col gap-1">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/fit", label: "Evaluate" },
                { href: "/case-study", label: "Case Study" },
                { href: "/resume", label: "Resume" },
                { href: "/portfolio", label: "Portfolio" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}>
                  <span className="hover:text-brand-copper transition-colors cursor-pointer">{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-2 text-surface-paper text-sm">Connect</h4>
            <div className="flex flex-col gap-1.5">
              {[
                { href: "mailto:calum@nineroads.com", icon: Mail, label: "calum@nineroads.com" },
                { href: "tel:727-900-4878", icon: Phone, label: "727-900-4878" },
                { href: "https://linkedin.com/in/calum-kershaw-a213bb15a", icon: Linkedin, label: "LinkedIn", external: true },
                { href: "https://github.com/Calum136", icon: Github, label: "GitHub", external: true },
                { href: "https://www.aicred.ai/profile/Calum136", icon: Award, label: "AICred", external: true },
              ].map(({ href, icon: Icon, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="hover:text-brand-copper transition-colors flex items-center gap-1.5"
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-5 pt-4 text-center text-xs text-surface-line">
          <p>&copy; {currentYear} Calum Kershaw. Built with TypeScript, React, and Claude AI.</p>
        </div>
      </div>
    </footer>
  );
}
