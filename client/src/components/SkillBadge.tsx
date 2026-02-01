import { motion } from "framer-motion";
import { useState } from "react";

interface SkillBadgeProps {
  name: string;
  description: string;
  icon: string;
  category: "gpt" | "skill" | "project";
}

export function SkillBadge({ name, description, icon, category }: SkillBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryColors = {
    gpt: "from-brand-copper/20 to-brand-copper/10",
    skill: "from-brand-moss/20 to-brand-moss/10", 
    project: "from-brand-stone/20 to-brand-stone/10"
  };

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
    >
      {/* Badge Circle */}
      <motion.div
        className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl cursor-pointer
          bg-gradient-to-br ${categoryColors[category]} border border-brand-espresso/20
          hover:border-brand-copper/40 transition-colors`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {icon}
      </motion.div>

      {/* Hover Pop-out */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        style={{
          right: "calc(100% + 12px)", // Position to the left of badge
          top: "50%",
          transform: "translateY(-50%)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          isHovered
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.85 }
        }
        transition={{ duration: 0.2 }}
      >
        <div className="bg-surface-charcoal border border-brand-copper/30 rounded-lg p-4 shadow-xl w-[280px]">
          <div className="flex items-start gap-3">
            <img
              src={iconSrc}
              alt={name}
              className="w-10 h-10 object-contain opacity-90"
              draggable={false}
            />
            <div className="flex-1">
              <h4 className="font-heading text-brand-copper font-semibold mb-1 text-sm">
                {name}
              </h4>
              <p className="text-xs text-surface-paper/70 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
