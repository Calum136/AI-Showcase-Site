import { Link } from "wouter";
import { Mail, Phone, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-ink text-brand-stone py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
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
              <Link href="/fit">
                <span className="hover:text-brand-copper transition-colors cursor-pointer">Fit Check</span>
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
                className="hover:text-brand-copper transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                calum@nineroads.com
              </a>
              <a
                href="tel:727-900-4878"
                className="hover:text-brand-copper transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                727-900-4878
              </a>
              <a
                href="https://linkedin.com/in/calum-kershaw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-copper transition-colors flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href="https://github.com/Calum136"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-copper transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-line/30 mt-8 pt-8 text-center text-sm text-surface-line">
          <p>&copy; 2025 Calum Kershaw. Built with TypeScript, React, and Claude AI.</p>
        </div>
      </div>
    </footer>
  );
}
