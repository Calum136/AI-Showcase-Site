export const customGPTs = [
  {
    name: "Clay News",
    description: "Tool-driven AI news with hard bans on market and hype content",
    icon: "/Clay.png",
    category: "gpt" as const,
    link: "/gpts/clay-news", // internal route
  },
  {
    name: "Weekly Stack Pipeline",
    description: "Guides through repeatable weekly publishing pipeline (markdown → Substack draft with visuals)",
    icon: "/WeeklyStack.png",
    category: "gpt" as const,
    link: "/gpts/weekly-stack", // internal route
  },
  {
    name: "EyeMage",
    description: "Creates conceptual images using fixed style and adaptive system states",
    icon: "/EyeMage.png",
    category: "gpt" as const,
    link: "/gpts/eye-mage", // internal route
  }
];

export const claudeSkills = [
  {
    name: "Mission Control",
    description: "Project and attention management system for AI learners juggling multiple goals",
    icon: "/MissionControl.png",
    category: "skill" as const,
    link: "/gpts/mission-control", // internal route
  },
  {
    name: "Workshop",
    description: "Business idea development and R&D specialist for brainstorming and validation",
    icon: "/Workshop.png",
    category: "skill" as const,
    link: "/gpts/workshop", // internal route
  }
];

export const miniProjects = [
  {
    name: "Gem Brawlers",
    description: "4-player physics brawler (loser gets upgrade, first to 5 wins)",
    icon: "/GemBrawlers.png",
    category: "project" as const,
    link: "/gpts/gem-brawlers", // internal route
  },
  {
    name: "Alchemy Island",
    description: "Idle game with 3 growth trajectories (expand island vs harvest essence)",
    icon: "/Alchemy.png",
    category: "project" as const,
    link: "/gpts/alchemy-island", // internal route
  },
  {
    name: "Rougelite Arena",
    description: "Enhanced brawler with upgrades and powerups",
    icon: "/Arena.png",
    category: "project" as const,
    link: "/gpts/rouglite-arena", // internal route
  }
];
