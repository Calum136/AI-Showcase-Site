import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";

interface SkillBadgeProps {
  name: string;
  description: string;
  icon: string;
  category: "gpt" | "skill" | "project";
  link?: string; // NEW: allows badge to navigate
}

export function SkillBadge({
  name,
  description,
  icon,
  category,
  link,
}: SkillBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryAccents = {
    gpt: "ring-brand-copper/35",
    skill: "ring-brand-moss/30",
    project: "ring-brand-espresso/20",
  };

  const isExternal = link?.startsWith("http");

  // --- Badge tile visual ---
  const Tile = (
    <motion.div
      className={[
        "w-24 h-24 rounded-3xl",
        "flex items-center justify-center cursor-pointer",
        "relative transition-all",
        "bg-surface-paper/70",
        "border border-surface-line/30",
        "shadow-[0_10px_30px_rgba(15,23,42,0.28)]",
        "hover:shadow-[0_16px_40px_rgba(15,23,42,0.38)]",
        "ring-1 ring-inset",
        categoryAccents[category],
      ].join(" ")}
      whileHover={{ scale: 1.04, y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/35 to-transparent pointer-events-none" />
      <img
        src={icon}
        alt={name}
        className="w-14 h-14 object-contain opacity-95"
        draggable={false}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </motion.div>
  );

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
    >
      {/* Clickable behavior */}
      {link ? (
        isExternal ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {Tile}
          </a>
        ) : (
          <Link href={link}>{Tile}</Link>
        )
      ) : (
        Tile
      )}

      {/* Pop-out (large, solid, readable) */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        style={{
          right: "calc(100% + 14px)",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.12 }}
      >
        <div
          className={[
            "bg-surface-ink",
            "border border-surface-line/40",
            "rounded-2xl",
            "p-7",
            "w-[720px]",
            "shadow-[0_22px_60px_rgba(15,23,42,0.55)]",
          ].join(" ")}
        >
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-surface-charcoal border border-surface-line/40 flex items-center justify-center">
              <img
                src={icon}
                alt={name}
                className="w-12 h-12 object-contain opacity-95"
                draggable={false}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="flex-1">
              <h4 className="font-heading text-surface-paper font-semibold mb-2 text-xl">
                {name}
              </h4>
              <p className="text-base text-surface-paper/75 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-brand-copper/25" />
        </div>
      </motion.div>
    </motion.div>
  );
}
