import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Award,
  FolderOpen,
  Download,
  CheckCircle2,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { generateResumePdf } from "@/lib/generateResumePdf";

import resumeData from "../../../content/resume.json";

// Single source of truth: content/resume.json feeds this page, the PDF download,
// and the static HTML written at build time by script/prerender.ts.
export type ResumeData = {
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
  impactSummary: string[];
  credential?: {
    label: string;
    rank: string;
    score: string;
    asOf: string;
  };
  skillGroups: Array<{
    category: string;
    skills: string[];
  }>;
  experience: Array<{
    position: string;
    company: string;
    period: string;
    scope: string;
    highlights: string[];
    techStack?: string[];
    keyAchievement?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year?: string;
  }>;
  certifications: string[];
  projects: Array<{
    name: string;
    description: string;
    url?: string;
  }>;
};

const CALUM_RESUME: ResumeData = resumeData as ResumeData;

export default function Resume() {
  const resume = CALUM_RESUME;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header with Impact Summary */}
        <div className="bg-surface-paper rounded-3xl p-6 md:p-8 border border-surface-line shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold font-display text-brand-red">
                    {resume.personalInfo.name}
                  </h1>
                  <p className="text-xl text-brand-copper mt-1 font-medium">
                    {resume.personalInfo.title}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/case-study">
                    <Button className="rounded-xl gap-2">
                      <BookOpen className="w-4 h-4" />
                      View Case Study
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="rounded-xl gap-2"
                    onClick={() => generateResumePdf(resume)}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <p className="text-brand-brown leading-relaxed max-w-2xl mb-6">
                {resume.personalInfo.summary}
              </p>

              {/* Impact Summary */}
              <div className="bg-brand-stone/50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-brand-charcoal mb-3">Key Impact</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {resume.impactSummary.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-brand-brown">
                      <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AICred Demonstrated Expertise */}
              <div className="bg-brand-stone/50 rounded-xl p-4 mt-4 border border-brand-copper/20">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-brand-copper" />
                  <h3 className="text-sm font-semibold text-brand-charcoal">Demonstrated Expertise</h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-brand-red">{resume.credential?.rank ?? "Top 10"}</span>
                    <span className="text-sm text-brand-brown">
                      {resume.credential?.label ?? "AICred Global Leaderboard"}
                      {resume.credential?.asOf ? ` (${resume.credential.asOf})` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-brand-copper">{resume.credential?.score ?? "9.2"}</span>
                    <span className="text-sm text-brand-brown">/10 Skill Fluency</span>
                  </div>
                </div>

                <p className="text-sm text-brand-brown/80 mb-3">
                  AICred is an adaptive learning platform that identifies specific gaps and builds personalized learning paths. My ranking demonstrates rapid skill-building in:
                </p>

                <ul className="grid sm:grid-cols-2 gap-1.5 mb-3">
                  <li className="flex items-start gap-2 text-sm text-brand-brown/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper mt-2 shrink-0" />
                    RAG architecture and knowledge systems
                  </li>
                  <li className="flex items-start gap-2 text-sm text-brand-brown/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper mt-2 shrink-0" />
                    Prompt engineering for operational reliability
                  </li>
                  <li className="flex items-start gap-2 text-sm text-brand-brown/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper mt-2 shrink-0" />
                    AI workflow automation and tool integration
                  </li>
                  <li className="flex items-start gap-2 text-sm text-brand-brown/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper mt-2 shrink-0" />
                    Decision support system design
                  </li>
                </ul>

                <p className="text-xs text-brand-brown/60 italic">
                  This ranking reflects active learning velocity and systematic improvement in how I architect and deploy AI systems—the technical foundations I apply in every project.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-brand-brown bg-brand-stone p-4 rounded-xl min-w-[240px]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-copper" />
                <a
                  className="hover:text-brand-copper transition-colors"
                  href={`mailto:${resume.personalInfo.email}`}
                >
                  {resume.personalInfo.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-copper" />
                <a
                  className="hover:text-brand-copper transition-colors"
                  href={`tel:${resume.personalInfo.phone.replace(/[^\d+]/g, "")}`}
                >
                  {resume.personalInfo.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-copper" />
                {resume.personalInfo.location}
              </div>

              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-brand-copper" />
                <a
                  className="hover:text-brand-copper transition-colors"
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
            {/* Grouped Skills */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-6 h-1 bg-brand-copper rounded-full" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.skillGroups.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-medium text-brand-copper mb-2">{group.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-2 py-0.5 text-xs font-normal rounded-md"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-copper" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.education.map((edu, i) => (
                  <div key={i} className="space-y-1">
                    <p className="font-medium text-sm text-brand-brown">{edu.institution}</p>
                    <p className="text-xs text-brand-brown/70">{edu.degree}</p>
                    {edu.year && <p className="text-xs text-brand-brown/70">{edu.year}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-copper" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resume.certifications.map((c) => (
                    <li key={c} className="text-xs flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-copper mt-1.5 shrink-0" />
                      <span className="text-brand-brown/70">{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-brand-copper" />
                  Key Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.projects.map((p) => (
                  <div key={p.name} className="space-y-1">
                    <div className="font-medium text-sm text-brand-brown">
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-copper underline-offset-2 hover:underline">
                          {p.name}
                        </a>
                      ) : (
                        p.name
                      )}
                    </div>
                    <div className="text-xs text-brand-brown/70">
                      {p.description}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Experience */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-display flex items-center gap-3 text-brand-brown">
              <Briefcase className="w-6 h-6 text-brand-copper" />
              Experience
            </h2>

            <div className="space-y-5">
              {resume.experience.map((exp, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{exp.position}</CardTitle>
                        <p className="text-brand-copper font-medium text-sm mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        {exp.period}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* One-line scope */}
                    <p className="text-brand-brown/70 text-sm mb-3">
                      {exp.scope}
                    </p>

                    {/* Impact bullets */}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-1.5 mb-3">
                        {exp.highlights.map((highlight, j) => (
                          <li key={j} className="text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-copper mt-2 shrink-0" />
                            <span className="text-brand-brown/80">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech stack */}
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {exp.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-xs bg-brand-stone rounded text-brand-brown"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Key achievement callout */}
                    {exp.keyAchievement && (
                      <div className="bg-brand-moss/10 border border-brand-moss/20 rounded-lg p-3 mt-3">
                        <p className="text-xs font-medium text-brand-moss">
                          Key Achievement: {exp.keyAchievement}
                        </p>
                      </div>
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
