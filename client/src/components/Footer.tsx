import { Link } from "wouter";
import { Mail, Phone, Linkedin, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-ink text-brand-stone py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* CTA Section */}
        <div className="text-center pb-10 mb-10 border-b border-white/10">
          <h3 className="text-2xl md:text-3xl font-bold text-surface-paper mb-3">
            Ready to evaluate fit?
          </h3>
          <p className="text-surface-line mb-6 max-w-md mx-auto">
            Let's discuss how I can help solve your operational challenges with AI systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ContactDialog>
              <Button
                size="lg"
                className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-surface-paper"
              >
                Contact Me <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </ContactDialog>
            <Link href="/fit">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-surface-paper/30 text-surface-paper hover:bg-surface-paper/10"
              >
                Try Evaluate Tool
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1: Branding */}
          <div>
            <h3 className="text-brand-red font-bold text-xl mb-2">Calum Kershaw</h3>
            <p className="text-surface-line text-sm">
              AI Solutions Developer & Systems Thinker
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-surface-paper">Quick Links</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/">
                <span className="hover:text-brand-copper transition-colors cursor-pointer">Home</span>
              </Link>
              <Link href="/about">
                <span className="hover:text-brand-copper transition-colors cursor-pointer">About</span>
              </Link>
              <Link href="/fit">
                <span className="hover:text-brand-copper transition-colors cursor-pointer">Evaluate</span>
              </Link>
              <Link href="/case-study">
                <span className="hover:text-brand-copper transition-colors cursor-pointer">Case Study</span>
              </Link>
              <Link href="/resume">
                <span className="hover:text-brand-copper transition-colors cursor-pointer">Resume</span>
              </Link>
              <Link href="/portfolio">
                <span className="hover:text-brand-copper transition-colors cursor-pointer">Portfolio</span>
              </Link>
            </nav>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h4 className="font-semibold mb-3 text-surface-paper">Connect</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <a
                href="mailto:calum@nineroads.com"
                className="hover:text-brand-copper hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                calum@nineroads.com
              </a>
              <a
                href="tel:727-900-4878"
                className="hover:text-brand-copper hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                727-900-4878
              </a>
              <a
                href="https://linkedin.com/in/calum-kershaw-a213bb15a"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-copper hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href="https://github.com/Calum136"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-copper hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-surface-line">
          <p>&copy; {currentYear} Calum Kershaw. Built with TypeScript, React, and Claude AI.</p>
        </div>
      </div>
    </footer>
  );
}
