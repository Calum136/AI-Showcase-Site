import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Award,
  FolderOpen,
} from "lucide-react";

type ResumeData = {
  personalInfo: {
    name: string;
    title: string;
    summary: string;
    email: string;
    phone: string;
    location: string;
    linkedinLabel: string;
    linkedinUrl: string;
  };
  skills: string[];
  experience: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  certifications: string[];
  projects: Array<{
    name: string;
    description: string;
  }>;
};

const CALUM_RESUME: ResumeData = {
  personalInfo: {
    name: "Calum Kershaw",
    title: "AI Solutions Developer & Systems Thinker",
    summary:
      "Developer focused on AI systems integration, automation, and decision support tools. Building practical solutions that solve real operational problems through strategic AI implementation. Combines data analysis background with modern AI development to deliver systems that actually work.",
    email: "calum@nineroads.com",
    phone: "727-900-4878",
    location: "Truro, NS",
    linkedinLabel: "linkedin.com/in/calum-kershaw",
    linkedinUrl: "https://linkedin.com/in/calum-kershaw-a213bb15a/",
  },

  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "OpenAI API",
    "Anthropic Claude",
    "RAG Systems",
    "Vector Databases",
    "PostgreSQL",
    "SQL",
    "Power BI",
    "Data Analysis",
    "Systems Design",
    "AI Integration",
    "Process Automation",
    "API Development",
  ],

  experience: [
    {
      position: "AI Systems Developer",
      company: "Independent Projects",
      period: "2025 - Present",
      description:
        "Building AI-powered tools and automation systems focused on decision support and operational efficiency.",
      highlights: [
        "JollyTails Staff Assistant: RAG-based knowledge system with OpenAI embeddings",
        "Fit Check AI: Job evaluation system using Claude API",
        "MCP server integrations for workflow automation",
        "Full-stack TypeScript applications with React + Express",
      ],
    },
    {
      position: "Operations Supervisor",
      company: "Jolly Tails Pet Resort • Halifax, NS",
      period: "2022 & Jan 2025 – Present",
      description:
        "Analyzed and optimized operational data processes for a high-capacity pet care facility, implementing quality controls and validation workflows.",
      highlights: [
        "Improved key operational KPIs by ~10% through data profiling and process optimization",
        "Built cross-system validation workflows for data integrity",
        "Acted as technology liaison troubleshooting data inconsistencies",
        "Developed SOPs and data-quality protocols",
      ],
    },
    {
      position: "Data Analyst",
      company: "STFX Advancement Department",
      period: "Apr 2024 – Feb 2025",
      description:
        "Profiled donor datasets and built rule-driven dashboards to surface data-quality issues and improve reporting accuracy.",
      highlights: [
        "Identified misclassifications and duplicate records across fragmented sources",
        "Implemented rule-based quality checks in Power BI dashboards",
        "Used SQL for data extraction, transformation, and validation",
        "Performed root cause analysis and validation improvements",
      ],
    },
    {
      position: "Student Manager",
      company: "Kevin's Corner Food Bank • Antigonish, NS",
      period: "Sep 2023 – Dec 2024",
      description:
        "Owned systems and operations scaling for a campus food bank; implemented data controls and workflow improvements.",
      highlights: [
        "Implemented data quality controls supporting ~140 additional regular users",
        "Designed volunteer management workflows enabling ~300% increase in operational hours",
        "Analysis contributed to ~45% increase in food donations",
      ],
    },
  ],

  education: [
    {
      institution: "St. Francis Xavier University",
      degree: "Post-Baccalaureate Diploma — Enterprise IT Management",
      year: "2024",
    },
    {
      institution: "Dalhousie University",
      degree: "BSc — Biology & Psychology",
      year: "2022",
    },
  ],

  certifications: [
    "How To Scale a Business with AI & Agentic Workflows — Maven (2025)",
    "Generative AI Leader — Google Cloud Skills Boost (2025)",
    "AI Mastery Membership — Marketing AI Institute (2024–Present)",
  ],

  projects: [
    {
      name: "JollyTails Staff Assistant",
      description:
        "AI-powered knowledge base using RAG with OpenAI embeddings, consolidating 20+ SOPs into a searchable system.",
    },
    {
      name: "Fit Check AI",
      description:
        "Job fit evaluation system using Claude API to analyze role alignment and provide structured recommendations.",
    },
  ],
};

export default function Resume() {
  const resume = CALUM_RESUME;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header - Full Width */}
        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold font-display">
                {resume.personalInfo.name}
              </h1>
              <p className="text-xl text-primary mt-1 font-medium">
                {resume.personalInfo.title}
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed max-w-2xl">
                {resume.personalInfo.summary}
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl min-w-[240px]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a
                  className="hover:text-primary transition-colors"
                  href={`mailto:${resume.personalInfo.email}`}
                >
                  {resume.personalInfo.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  className="hover:text-primary transition-colors"
                  href={`tel:${resume.personalInfo.phone.replace(/[^\d+]/g, "")}`}
                >
                  {resume.personalInfo.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {resume.personalInfo.location}
              </div>

              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-primary" />
                <a
                  className="hover:text-primary transition-colors"
                  href={resume.personalInfo.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Skills, Education, Certifications */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-6 h-1 bg-accent rounded-full" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-2.5 py-1 text-xs font-normal rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.education.map((edu, i) => (
                  <div key={i} className="space-y-1">
                    <p className="font-medium text-sm">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.year}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resume.certifications.map((c) => (
                    <li key={c} className="text-xs flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span className="text-muted-foreground">{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  Key Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.projects.map((p) => (
                  <div key={p.name} className="space-y-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.description}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Experience */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-display flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-primary" />
              Experience
            </h2>

            <div className="space-y-5">
              {resume.experience.map((exp, i) => (
                <Card
                  key={i}
                  className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{exp.position}</CardTitle>
                        <p className="text-primary font-medium text-sm mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        {exp.period}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      {exp.description}
                    </p>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-1.5">
                        {exp.highlights.map((highlight, j) => (
                          <li key={j} className="text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                            <span className="text-foreground/80">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
