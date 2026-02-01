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
        className="absolute left-0 top-0 z-10 pointer-events-none
             bg-stone-800/95 text-white
             rounded-xl shadow-2xl
             p-4 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
        animate={
          isHovered
            ? { opacity: 1, scale: 1.15, x: -30, y: -15 }
            : { opacity: 0, scale: 0.8, x: 0, y: 0 }
        }
        transition={{ duration: 0.3 }}
      >
        <div className="bg-surface-charcoal border border-brand-copper/30 rounded-lg p-4 shadow-xl min-w-[250px]">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{icon}</div>
            <div className="flex-1">
              <h4 className="font-heading text-brand-copper font-semibold mb-1">
                {name}
              </h4>
              <p className="text-sm text-surface-paper/70 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
