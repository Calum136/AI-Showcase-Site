import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Database,
  FileText,
  Lightbulb,
  MessageCircle,
  Search,
  Settings,
  Target,
  Users,
  Zap,
  BookOpen,
  GitBranch,
  ExternalLink,
  Shield,
  MapPin,
  Calculator,
} from "lucide-react";
import { Link } from "wouter";
import { ContactDialog } from "@/components/ContactDialog";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function MaritimeHomeMapCaseStudy() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <motion.div {...fadeIn} className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Case Study
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold font-display">
            Maritime Home Map
          </h1>
          <p className="text-xl text-brand-brown/80 max-w-2xl mx-auto">
            A Nova Scotia mortgage affordability calculator with interactive map
            — enter your income, debts, and lifestyle and see which NS
            municipalities you can realistically afford, colour-coded by
            financial zone.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">30+</div>
              <div className="text-xs text-brand-brown/70">NS Municipalities</div>
            </div>
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">15+</div>
              <div className="text-xs text-brand-brown/70">Financial Variables</div>
            </div>
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">OSFI B-20</div>
              <div className="text-xs text-brand-brown/70">Stress Test</div>
            </div>
          </div>
        </motion.div>

        {/* Executive Summary */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.1 }}
          className="bg-surface-paper rounded-2xl p-6 md:p-8 border border-surface-line/50 shadow-sm"
        >
          <h3 className="font-semibold mb-4 text-brand-charcoal text-lg">Executive Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Problem</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Nova Scotia home buyers don't have a simple, honest tool that shows them what they can actually afford.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Stakes</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Generic Canadian calculators miss local data (property tax, utilities, municipal economics). Existing tools locked behind agent relationships.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Solution</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Calculator-first web app with financial model engine, Mapbox choropleth map, and property stress tester.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Outcome</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  In active development. Early build with real PVSC + StatsCan data mapped.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs font-medium text-brand-brown/60">Stack:</span>
                {["React", "TypeScript", "Mapbox GL", "Vite", "TailwindCSS"].map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs bg-brand-stone rounded text-brand-brown">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two-column body: main content left, sidebar right */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">

          {/* ===== LEFT COLUMN: Main content ===== */}
          <div className="space-y-10">

        {/* The Problem */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.2 }}
          id="the-problem"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-brand-red" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">The Problem</h2>
          </div>

          <Card className="border-surface-line/50">
            <CardContent className="pt-6 space-y-4">
              <p className="text-brand-brown/80">
                Nova Scotia home buyers don't have a simple, honest tool that shows them
                what they can actually afford — accounting for{" "}
                <strong className="text-brand-charcoal">property tax, utilities, debt load, stress testing,
                and neighbourhood economic health</strong> — all in one place.
              </p>

              <p className="text-brand-brown/80">
                Existing tools are either generic Canadian calculators or expensive real
                estate platforms locked behind agent relationships.
              </p>

              <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl p-4 mt-4">
                <h4 className="font-semibold text-brand-red mb-2">What's Missing</h4>
                <ul className="text-sm space-y-1 text-brand-brown/80">
                  <li>• Local property tax rates by municipality</li>
                  <li>• Utility cost estimates by heating type and home size</li>
                  <li>• OSFI B-20 stress test applied honestly</li>
                  <li>• Neighbourhood economic health indicators</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* The Approach */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.3 }}
          id="the-approach"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-charcoal/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-charcoal" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">The Approach</h2>
          </div>

          <p className="text-brand-brown/80">
            Built a calculator-first web app (no AI chat, no fluff) with three layers:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-copper" />
                  Financial Model Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  OSFI-compliant mortgage math — GDS/TDS ratio calculations
                  (CMHC guidelines: ≤39% / ≤44%), B-20 stress test (higher of
                  rate + 2% or 5.25%), CMHC premium calculation for &lt;20% down.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-copper" />
                  Choropleth Map
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Mapbox-powered interactive map that colour-codes NS
                  municipalities by affordability zone. Zones update live as
                  income/debt sliders change.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-brand-copper" />
                  Property Stress Tester
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Drop in a specific asking price and get a full monthly
                  breakdown including property tax from NS municipal lookup,
                  utility estimates by home size + heating type.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Map Zones */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.4 }}
          id="map-zones"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-brown/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-brand-brown" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Map Zones</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-surface-line rounded-xl overflow-hidden">
              <thead className="bg-brand-stone/50">
                <tr>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Zone</th>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Threshold</th>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-moss">Green</td>
                  <td className="p-3 text-brand-brown/80">≤35% of gross income</td>
                  <td className="p-3 text-brand-brown/80">Comfortable — within standard guidelines</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-yellow-600">Yellow</td>
                  <td className="p-3 text-brand-brown/80">36–48% of gross income</td>
                  <td className="p-3 text-brand-brown/80">Trade-offs required — stretched but possible</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-red">Red</td>
                  <td className="p-3 text-brand-brown/80">&gt;48% of gross income</td>
                  <td className="p-3 text-brand-brown/80">Financial strain — not recommended</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Card className="border-brand-moss/30 bg-brand-moss/5">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-brand-moss mb-2">How Zones Work</h4>
              <p className="text-sm text-brand-brown/80">
                Zone colours update live as income/debt sliders change. Based on PVSC
                average assessed values by municipality, not live MLS (clearly
                disclosed to users).
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Data Sources & Status */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.5 }}
          id="data-sources"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-moss/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-brand-moss" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Data Sources & Status</h2>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="w-4 h-4 text-brand-copper" />
                    PVSC Assessed Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-brown/80">
                  <p>Average home price proxy by municipality.</p>
                </CardContent>
              </Card>

              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-copper" />
                    StatsCan 2021 Community Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-brown/80">
                  <p>Median income, unemployment rate, population trend per CSD.</p>
                </CardContent>
              </Card>

              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-copper" />
                    NS Municipal Tax Rates
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-brown/80">
                  <p>Manually maintained lookup table.</p>
                </CardContent>
              </Card>

              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-copper" />
                    NS Power Residential Rates
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-brown/80">
                  <p>Utility estimates by heating type and square footage.</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-brand-moss/30 bg-brand-moss/5">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-brand-moss mb-2">Status</h4>
                <p className="text-sm text-brand-brown/80">
                  In active development. Early build with real PVSC + StatsCan data mapped.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

          </div>{/* end left column */}

          {/* ===== RIGHT COLUMN: Sidebar ===== */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">

            {/* Table of Contents */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.15 }}
              className="bg-brand-stone/50 rounded-2xl p-5 border border-surface-line/50"
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-brand-charcoal text-sm">
                <BookOpen className="w-4 h-4" />
                Contents
              </h3>
              <nav className="flex flex-col gap-1.5 text-sm">
                {[
                  "The Problem",
                  "The Approach",
                  "Map Zones",
                  "Data Sources",
                  "Constraints",
                  "Financial Model",
                  "Tech Stack",
                ].map((item, i) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-brand-brown/70 hover:text-brand-copper transition-colors"
                  >
                    {i + 1}. {item}
                  </a>
                ))}
              </nav>
            </motion.div>

            {/* Constraints & Tradeoffs */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.55 }}
              id="constraints"
            >
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-charcoal" />
                    Constraints & Tradeoffs
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-brand-brown/80 space-y-3">
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Data Currency</h4>
                    <p>Uses PVSC assessed values as proxy, not live MLS listings — disclosed to users.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Utility Estimates</h4>
                    <p>70th percentile estimates by heating type, clearly labelled as estimates.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Single Income Risk</h4>
                    <p>Inline badge warns when no partner income entered.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Municipal Coverage</h4>
                    <p>30+ NS municipalities mapped, expanding over time.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Financial Model */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.7 }}
              id="financial-model"
            >
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-brand-copper" />
                    Financial Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-brand-brown/80 space-y-3">
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">GDS/TDS Ratios</h4>
                    <p>CMHC guidelines ≤39% / ≤44%</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Stress Test</h4>
                    <p>OSFI B-20 — higher of (rate + 2%) or 5.25%</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Insurance</h4>
                    <p>CMHC premium calculated for &lt;20% down payment</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Property Tax</h4>
                    <p>NS municipal lookup table</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.8 }}
              id="tech-stack"
            >
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-brand-copper" />
                    Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "React",
                      "TypeScript",
                      "Mapbox GL",
                      "Vite",
                      "TailwindCSS",
                      "Netlify",
                    ].map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="px-2 py-0.5 text-xs border-surface-line text-brand-brown"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>{/* end right column */}

        </div>{/* end two-column grid */}

        {/* Closing CTA */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.9 }}
          className="bg-surface-paper rounded-2xl p-8 md:p-10 text-center space-y-6 border border-surface-line/50 shadow-sm"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal">
            Want to discuss a similar challenge?
          </h3>
          <p className="text-brand-brown/80 max-w-xl mx-auto">
            I build AI systems that solve real operational problems. Whether it's
            knowledge management, process automation, or decision support — let's talk
            about what you're trying to solve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ContactDialog>
              <Button
                size="lg"
                className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-surface-paper"
              >
                Contact Me <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </ContactDialog>
            <Link href="/resume">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-2 hover:border-brand-copper"
              >
                View Resume
              </Button>
            </Link>
            <Link href="/fit">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-xl text-brand-copper hover:text-brand-copper/80 hover:bg-brand-copper/5"
              >
                Try Evaluate Tool <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
