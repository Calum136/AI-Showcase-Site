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
    title: "Data Analyst (Data Quality • Operations Systems • Reporting)",
    summary:
      "People-forward, detail-oriented Data Analyst with 3 years of experience in data profiling, quality analysis, and rule-based validation across academic and operational environments. Known for building dashboards and validation processes that improve decision-making in fast-moving settings, and for acting as a practical technology liaison during system and process change.",
    email: "calum@nineroads.com",
    phone: "727-900-4878",
    location: "Truro, NS",
    linkedinLabel: "linkedin.com/in/calum-kershaw-a213bb15a/",
    linkedinUrl: "https://linkedin.com/in/calum-kershaw-a213bb15a/",
  },

  skills: [
    "Data Quality & Analysis",
    "Technical Skills",
    "Communication & Collaboration",
    "Data Profiling & Quality Rules",
    "SQL Query Design",
    "Stakeholder Management",
    "Data Analysis & Pattern Recognition",
    "Python Programming",
    "Clear and Effective Leadership & Teamwork",
    "Root Cause Analysis",
    "Advanced Excel & Data Modeling",
    "Requirements Gathering",
    "Data Controls & Validation",
    "Power BI & Tableau",
    "Community Engagement",
    "Problem-Solving & Investigation",
    "R Studio Programming",
    "Technology Liaison & Translator",
    "Management Reporting",
    "Project Management",
    "Strategic Goal Development",
  ],

  experience: [
    {
      position: "Operations Supervisor",
      company: "Jolly Tails Pet Resort • Halifax, NS",
      period: "2022 & Jan 2025 – Present",
      description:
        "Analyzed and optimized operational data processes for a high-capacity pet care facility, implementing quality controls and validation workflows across scheduling, inventory, and financial tracking.",
      highlights: [
        "Improved key operational KPIs by ~10% by profiling scheduling, finance, and inventory data, then addressing process and data-quality gaps.",
        "Built cross-system validation workflows (consistency checks + rule-based logic) to detect discrepancies and maintain data integrity.",
        "Created quality controls for staffing/scheduling data to optimize allocation and reduce operational incidents through pattern recognition and root cause analysis.",
        "Acted as a technology liaison: troubleshooting data inconsistencies and improving reliability of operational platforms.",
        "Developed SOPs and data-quality protocols; led hiring, training, onboarding, and change adoption across teams.",
      ],
    },
    {
      position: "Data Analyst",
      company: "STFX Advancement Department • Halifax/Antigonish, NS",
      period: "Apr 2024 – Feb 2025",
      description:
        "Profiled donor datasets and built rule-driven dashboards to surface data-quality issues, standardize classifications, and improve reporting accuracy.",
      highlights: [
        "Identified misclassifications, duplicate records, and invalid categorizations across fragmented Excel and semi-structured sources.",
        "Implemented rule-based quality checks inside Power BI dashboards to detect missing segments, repeats, and classification errors.",
        "Used SQL to extract/transform/validate data from multiple sources (including text exports and screenshots).",
        "Performed root cause analysis and validation improvements to streamline storage and improve query performance.",
        "Partnered with stakeholders to gather requirements; completed UAT to ensure controls matched business needs.",
      ],
    },
    {
      position: "Student Manager",
      company: "Kevin’s Corner Food Bank • Antigonish, NS",
      period: "Sep 2023 – Dec 2024",
      description:
        "Owned systems and operations scaling for a campus food bank; implemented data controls and workflow improvements to support rapid growth.",
      highlights: [
        "Implemented data quality controls that supported scaling to accommodate ~140 additional regular users.",
        "Built partnership proposals and supported requirements gathering as a technology liaison for operational improvements.",
        "Designed volunteer management + scheduling workflows with validation logic, enabling a ~300% increase in operational hours.",
        "Used analysis to identify partnership opportunities, contributing to a ~45% increase in food donations.",
        "Created documentation (process maps + validation procedures) and supported UAT on implemented solutions.",
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
      name: "Power BI Financial Analytics Platform",
      description:
        "Designed an analytics solution using Power BI, Tableau, and SQL to replace manual reporting and improve accuracy and decision-making.",
    },
    {
      name: "Volunteer Management System Optimization",
      description:
        "Built process maps and optimized workflows for a 110+ member team, enabling a ~250% increase in operational hours and improved service utilization.",
    },
  ],
};

export default function Resume() {
  const resume = CALUM_RESUME;

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">
              {resume.personalInfo.name}
            </h1>
            <p className="text-xl text-primary mt-1 font-medium">
              {resume.personalInfo.title}
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed max-w-xl">
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
                {resume.personalInfo.linkedinLabel}
              </a>
            </div>
          </div>
        </div>

        {/* Skills */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded-full" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1.5 text-sm font-normal rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
              >
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Experience */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-display flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-primary" />
            Experience
          </h2>

          <div className="space-y-6">
            {resume.experience.map((exp, i) => (
              <Card
                key={i}
                className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl">{exp.position}</CardTitle>
                      <p className="text-primary font-medium mt-1">
                        {exp.company}
                      </p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {exp.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {exp.description}
                  </p>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, j) => (
                      <li key={j} className="text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span className="text-foreground/80">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-display flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-primary" />
            Education
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {resume.education.map((edu, i) => (
              <Card key={i} className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{edu.institution}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-foreground">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.year}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded-full" />
              Certifications & Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {resume.certifications.map((c) => (
                <li key={c} className="text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span className="text-foreground/80">{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded-full" />
              Relevant Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resume.projects.map((p) => (
              <div key={p.name} className="space-y-1">
                <div className="font-medium text-foreground">{p.name}</div>
                <div className="text-sm text-muted-foreground">
                  {p.description}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
