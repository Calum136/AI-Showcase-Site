import { Layout } from "@/components/Layout";
import { useResume } from "@/hooks/use-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, GraduationCap, Mail, MapPin } from "lucide-react";

export default function Resume() {
  const { data: resume, isLoading, error } = useResume();

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8 animate-pulse">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (error || !resume) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-destructive">Failed to load resume</h2>
          <p className="text-muted-foreground mt-2">Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">{resume.personalInfo.name}</h1>
            <p className="text-xl text-primary mt-1 font-medium">{resume.personalInfo.title}</p>
            <p className="text-muted-foreground mt-4 leading-relaxed max-w-xl">
              {resume.personalInfo.summary}
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl min-w-[240px]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              {resume.personalInfo.email}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {resume.personalInfo.location}
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
              <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl">{exp.position}</CardTitle>
                      <p className="text-primary font-medium mt-1">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="w-fit">{exp.period}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{exp.description}</p>
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
                  <p className="text-sm text-muted-foreground mt-1">{edu.year}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
