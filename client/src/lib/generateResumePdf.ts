import jsPDF from "jspdf";

type ResumeData = {
  personalInfo: {
    name: string;
    title: string;
    summary: string;
    email: string;
    phone: string;
    location: string;
    linkedinLabel: string;
  };
  impactSummary: string[];
  skillGroups: Array<{ category: string; skills: string[] }>;
  experience: Array<{
    position: string;
    company: string;
    period: string;
    scope: string;
    highlights: string[];
    techStack?: string[];
    keyAchievement?: string;
  }>;
  education: Array<{ institution: string; degree: string; year: string }>;
  certifications: string[];
  projects: Array<{ name: string; description: string }>;
};

const PAGE_WIDTH = 210;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 5;
const SECTION_GAP = 8;

export function generateResumePdf(resume: ResumeData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  function checkPage(needed: number) {
    if (y + needed > 280) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function addSectionHeader(text: string) {
    checkPage(12);
    y += SECTION_GAP;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(text.toUpperCase(), MARGIN, y);
    y += 1.5;
    doc.setDrawColor(160, 160, 160);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 4;
  }

  function addText(text: string, fontSize = 9.5, style: "normal" | "bold" | "italic" = "normal") {
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    checkPage(lines.length * LINE_HEIGHT);
    doc.text(lines, MARGIN, y);
    y += lines.length * LINE_HEIGHT;
  }

  function addBullet(text: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const bulletIndent = MARGIN + 4;
    const bulletWidth = CONTENT_WIDTH - 4;
    const lines = doc.splitTextToSize(text, bulletWidth);
    checkPage(lines.length * LINE_HEIGHT);
    doc.text("\u2022", MARGIN, y);
    doc.text(lines, bulletIndent, y);
    y += lines.length * LINE_HEIGHT;
  }

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(resume.personalInfo.name, MARGIN, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(resume.personalInfo.title, MARGIN, y);
  y += 6;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const contactLine = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedinLabel,
  ].join("  |  ");
  doc.text(contactLine, MARGIN, y);
  y += 6;

  // --- Summary ---
  addText(resume.personalInfo.summary, 9.5, "normal");
  y += 2;

  // --- Key Impact ---
  addSectionHeader("Key Impact");
  for (const item of resume.impactSummary) {
    addBullet(item);
  }

  // --- Skills ---
  addSectionHeader("Skills");
  for (const group of resume.skillGroups) {
    checkPage(LINE_HEIGHT * 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    doc.text(`${group.category}: `, MARGIN, y);
    const labelWidth = doc.getTextWidth(`${group.category}: `);
    doc.setFont("helvetica", "normal");
    const skillText = group.skills.join(", ");
    const skillLines = doc.splitTextToSize(skillText, CONTENT_WIDTH - labelWidth);
    if (skillLines.length === 1) {
      doc.text(skillLines[0], MARGIN + labelWidth, y);
      y += LINE_HEIGHT;
    } else {
      // First line next to label, rest below at margin
      doc.text(skillLines[0], MARGIN + labelWidth, y);
      y += LINE_HEIGHT;
      for (let i = 1; i < skillLines.length; i++) {
        checkPage(LINE_HEIGHT);
        doc.text(skillLines[i], MARGIN, y);
        y += LINE_HEIGHT;
      }
    }
  }

  // --- Experience ---
  addSectionHeader("Experience");
  for (const job of resume.experience) {
    checkPage(20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(job.position, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 100, 100);
    doc.text(job.period, PAGE_WIDTH - MARGIN, y, { align: "right" });
    y += LINE_HEIGHT;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(80, 80, 80);
    doc.text(job.company, MARGIN, y);
    y += LINE_HEIGHT + 1;

    for (const highlight of job.highlights) {
      addBullet(highlight);
    }

    if (job.techStack && job.techStack.length > 0) {
      checkPage(LINE_HEIGHT);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`Tech: ${job.techStack.join(", ")}`, MARGIN, y);
      y += LINE_HEIGHT;
    }

    y += 3;
  }

  // --- Projects ---
  addSectionHeader("Projects");
  for (const project of resume.projects) {
    checkPage(LINE_HEIGHT * 3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    doc.text(project.name, MARGIN, y);
    y += LINE_HEIGHT;
    addText(project.description);
    y += 2;
  }

  // --- Education ---
  addSectionHeader("Education");
  for (const edu of resume.education) {
    checkPage(LINE_HEIGHT * 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    doc.text(edu.degree, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(edu.year, PAGE_WIDTH - MARGIN, y, { align: "right" });
    y += LINE_HEIGHT;
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80, 80, 80);
    doc.text(edu.institution, MARGIN, y);
    y += LINE_HEIGHT + 2;
  }

  // --- Certifications ---
  addSectionHeader("Certifications");
  for (const cert of resume.certifications) {
    addBullet(cert);
  }

  doc.save("Calum_Kershaw_Resume.pdf");
}
