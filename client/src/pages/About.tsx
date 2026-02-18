import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Linkedin, Github, Lightbulb, Target, Workflow, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { ContactDialog } from "@/components/ContactDialog";

export default function About() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-brand-copper/30 shrink-0">
            <img
              src="/CalumHeadshot.png"
              alt="Calum Kershaw"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-red mb-2">
              Calum Kershaw
            </h1>
            <p className="text-xl text-brand-copper font-medium mb-4">
              AI Systems Developer & Process Analyst
            </p>
            <p className="text-brand-brown/80 max-w-xl leading-relaxed">
              I build AI systems that solve real operational problems—not demos,
              but tools people actually use. My work sits at the intersection of
              AI capabilities and business operations.
            </p>
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.section
          className="bg-surface-paper rounded-2xl p-6 md:p-8 border border-surface-line"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-brand-charcoal mb-6">
            How did I become an AI developer?
          </h2>
          <div className="space-y-4 text-brand-brown/80 leading-relaxed">
            <p>
              My path to AI development wasn't traditional. I started with a biology
              and psychology background at Dalhousie, where I learned to think in systems—
              understanding how complex organisms and behaviors emerge from simpler rules.
            </p>
            <p>
              Working at JollyTails Pet Resort, I saw firsthand how operational chaos
              creates real problems: scattered SOPs, inconsistent training, staff spending
              more time searching for answers than helping customers. When I looked at
              these problems through a systems lens, AI wasn't just a cool technology—it
              was the obvious solution.
            </p>
            <p>
              That's when I built my first production AI system: a RAG-powered knowledge
              base that unified 20+ documents into searchable, instant answers. Watching
              staff go from frustrated searches to confident responses in seconds—that's
              when I knew this was what I wanted to build.
            </p>
            <p>
              I completed a Post-Baccalaureate Diploma in Enterprise IT Management at
              St. Francis Xavier, combining my systems thinking with formal technical training.
              Now I focus on building AI tools that create measurable operational improvements.
            </p>
            <p>
              My commitment to continuous learning is reflected in my{" "}
              <a
                href="https://www.aicred.ai/profile/Calum136"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-copper hover:underline"
              >
                AICred ranking
              </a>
              —currently <strong className="text-brand-copper">#8 globally</strong> with a{" "}
              <strong className="text-brand-copper">9.2/10 skill fluency</strong> score.
              AICred is an adaptive learning platform that identifies gaps and builds
              personalized learning paths. This ranking demonstrates active learning
              velocity in RAG architecture, prompt engineering, workflow automation,
              and decision support system design.
            </p>
          </div>
        </motion.section>

        {/* Philosophy Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-brand-charcoal mb-6">
            What's my approach to building AI systems?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface-paper rounded-xl p-6 border border-surface-line">
              <div className="w-12 h-12 rounded-lg bg-brand-copper/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-brand-copper" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">
                Problem First, Tech Second
              </h3>
              <p className="text-sm text-brand-brown/70 leading-relaxed">
                I don't start with "how can I use AI?" I start with "what's the actual
                problem?" Sometimes AI is the answer. Sometimes a spreadsheet is. The
                goal is solving the problem, not using the technology.
              </p>
            </div>

            <div className="bg-surface-paper rounded-xl p-6 border border-surface-line">
              <div className="w-12 h-12 rounded-lg bg-brand-moss/10 flex items-center justify-center mb-4">
                <Workflow className="w-6 h-6 text-brand-moss" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">
                Systems Over Features
              </h3>
              <p className="text-sm text-brand-brown/70 leading-relaxed">
                A feature solves one problem. A system creates capacity. I design for
                how tools fit into existing workflows, how they'll scale, and how
                they'll handle edge cases—not just the happy path.
              </p>
            </div>

            <div className="bg-surface-paper rounded-xl p-6 border border-surface-line">
              <div className="w-12 h-12 rounded-lg bg-brand-red/10 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">
                Shipped Beats Perfect
              </h3>
              <p className="text-sm text-brand-brown/70 leading-relaxed">
                I've seen too many "AI initiatives" die in planning. I build iteratively:
                get something working, put it in front of users, learn what actually
                matters, then improve. Real feedback beats theoretical design.
              </p>
            </div>
          </div>
        </motion.section>

        {/* What I'm Looking For */}
        <motion.section
          className="bg-brand-stone/50 rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4">
            What kind of work energizes me?
          </h2>
          <p className="text-brand-brown/80 leading-relaxed mb-4">
            I'm most energized by roles where I can build AI systems that solve real
            operational problems—not just prototypes, but tools that people use daily.
            I thrive in environments where I can see the direct impact of my work on
            how a team or organization operates.
          </p>
          <p className="text-brand-brown/80 leading-relaxed">
            Ideal fits: AI-forward companies building internal tools, operations teams
            looking to leverage AI, or organizations with knowledge management challenges
            that need systematic solutions.
          </p>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          className="bg-surface-ink rounded-2xl p-8 md:p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-surface-paper mb-3">
            Let's Talk
          </h2>
          <p className="text-surface-line mb-6 max-w-lg mx-auto">
            Whether you have a specific project in mind or just want to discuss
            how AI might fit into your operations, I'd love to connect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <ContactDialog>
              <Button
                size="lg"
                className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-surface-paper"
              >
                Get In Touch <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </ContactDialog>
            <Link href="/case-study">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-surface-paper/30 text-surface-paper hover:bg-surface-paper/10"
              >
                <BookOpen className="mr-2 w-4 h-4" />
                See My Work
              </Button>
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            <a
              href="mailto:calum@nineroads.com"
              className="text-surface-paper/70 hover:text-brand-copper transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/calum-kershaw-a213bb15a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-paper/70 hover:text-brand-copper transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/Calum136"
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-paper/70 hover:text-brand-copper transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
