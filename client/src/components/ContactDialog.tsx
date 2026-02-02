import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Linkedin, X } from "lucide-react";

type ContactDialogProps = {
  triggerClassName?: string;
  triggerLabel?: string;
};

export function ContactDialog({
  triggerClassName = "",
  triggerLabel = "View Contact Info",
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative w-[92vw] max-w-[860px] rounded-2xl border border-surface-line/40 bg-surface-ink shadow-[0_22px_80px_rgba(15,23,42,0.75)]"
          >
            {/* Close (top-right) */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-xl p-2 text-surface-paper/70 hover:text-surface-paper hover:bg-surface-paper/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Headshot */}
                <div className="shrink-0">
                  <img
                    src="/CalumHeadshot.png"
                    alt="Calum Kershaw"
                    className="w-28 h-28 rounded-2xl object-cover ring-1 ring-inset ring-surface-paper/15 shadow-[0_14px_40px_rgba(15,23,42,0.45)]"
                    draggable={false}
                  />
                </div>

                {/* Copy + links */}
                <div className="flex-1">
                  <h3 className="font-heading text-2xl md:text-3xl text-surface-paper font-semibold">
                    Connect with Calum
                  </h3>

                  <p className="mt-2 text-base md:text-lg text-surface-paper/75 leading-relaxed">
                    Best way to reach me is email. If you include the role and what
                    you’re trying to solve, I’ll respond with the clearest next step.
                  </p>

                  <div className="mt-7 grid gap-4">
                    <a
                      href="mailto:calum@nineroads.com"
                      className="flex items-center gap-3 rounded-xl border border-surface-line/40 bg-surface-charcoal/70 px-5 py-4 text-surface-paper hover:bg-surface-charcoal/90 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-brand-copper" />
                      <span className="text-base md:text-lg">calum@nineroads.com</span>
                    </a>

                    <a
                      href="tel:7279004878"
                      className="flex items-center gap-3 rounded-xl border border-surface-line/40 bg-surface-charcoal/70 px-5 py-4 text-surface-paper hover:bg-surface-charcoal/90 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-brand-copper" />
                      <span className="text-base md:text-lg">727-900-4878</span>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/calum-kershaw-a213bb15a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-surface-line/40 bg-surface-charcoal/70 px-5 py-4 text-surface-paper hover:bg-surface-charcoal/90 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-brand-copper" />
                      <span className="text-base md:text-lg">LinkedIn</span>
                    </a>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-brand-copper px-6 py-3 text-surface-paper font-semibold hover:bg-brand-copper/90 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-brand-copper/20" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>

      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
}
