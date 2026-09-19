import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calculator,
  Camera,
  CheckCircle2,
  ExternalLink,
  Home,
  Lightbulb,
  Link2,
  Printer,
  ShieldCheck,
  Target,
  Clock,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const LIVE_URL = "https://goldriverhomes.netlify.app/";

const shipped = [
  {
    icon: Home,
    title: "Guided chapters, one decision at a time",
    body: "Twenty plain-language questions grouped into named chapters: the home, the land, the foundation, water, septic, finishes, and financing. No sliders, no jargon.",
  },
  {
    icon: Calculator,
    title: "Price, payment, and reason on every choice",
    body: "Each option shows its exact price difference, its effect on the monthly payment, and a short Nova Scotia-specific reason it matters.",
  },
  {
    icon: ShieldCheck,
    title: "Canadian mortgage math, done correctly",
    body: "Semi-annual compounding, minimum down payment rules, and CMHC premiums. Totals are shown as ranges because site costs genuinely vary.",
  },
  {
    icon: Camera,
    title: "Photo system with provenance",
    body: "81 approved photos, each recorded with its source, licence, credit, and a caption that says exactly what it shows. An automated coverage report lists every gap.",
  },
  {
    icon: Link2,
    title: "Shareable configurations",
    body: "A buyer's whole configuration fits in a link with a checksum. 2,000 randomised states were round-tripped exactly, and damaged links are rejected rather than silently misread.",
  },
  {
    icon: Printer,
    title: "A real ending",
    body: "A review-and-refine page, named saves, a printable spec sheet, and a pre-written enquiry email so the buyer can hand their plan straight to the dealer.",
  },
];

export function GoldRiverContent() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <motion.div {...fadeIn} className="text-center space-y-4">
        <Badge variant="secondary" className="mb-4">
          Case Study · Client Delivery
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold font-display">Gold River Homes</h1>
        <p className="text-xl text-brand-brown/80 max-w-2xl mx-auto">
          A live cost configurator that lets first-time buyers price a modular home from
          bare land to monthly payment, built for a Supreme Homes retailer in Chester Basin,
          Nova Scotia.
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
          <div className="text-center p-4 bg-brand-stone rounded-xl">
            <div className="text-2xl font-bold text-brand-copper">20</div>
            <div className="text-xs text-brand-brown/70">Guided decisions</div>
          </div>
          <div className="text-center p-4 bg-brand-stone rounded-xl">
            <div className="text-2xl font-bold text-brand-copper">81</div>
            <div className="text-xs text-brand-brown/70">Licensed photos</div>
          </div>
          <div className="text-center p-4 bg-brand-stone rounded-xl">
            <div className="text-2xl font-bold text-brand-copper">2,000</div>
            <div className="text-xs text-brand-brown/70">Share links verified</div>
          </div>
        </div>

        <div className="pt-4">
          <a href={LIVE_URL} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-xl gap-2">
              <ExternalLink className="w-4 h-4" />
              View the live configurator
            </Button>
          </a>
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
                The owner asked for a modular home calculator that covers everything a buyer actually
                pays for: the home, land, well, septic, municipal hookups, and servicing.
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Stakes</span>
              <p className="text-sm text-brand-brown/80 mt-1">
                First-time buyers see a sticker price and miss tens of thousands in site costs. Surprises
                late in the process lose sales and trust.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Solution</span>
              <p className="text-sm text-brand-brown/80 mt-1">
                A photo-first, question-driven configurator that tells the buyer what each choice costs,
                what it does to the monthly payment, and why it matters in Nova Scotia.
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Outcome</span>
              <p className="text-sm text-brand-brown/80 mt-1">
                Live in production since September 2026. Remaining work is waiting on the dealer's real
                lot, model, and option pricing.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-medium text-brand-brown/60">Stack:</span>
              {["Next.js", "React", "TypeScript", "Tailwind CSS", "Recharts", "Netlify"].map((t) => (
                <span key={t} className="px-2 py-0.5 text-xs bg-brand-stone rounded text-brand-brown">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* The Problem */}
      <motion.section {...fadeIn} transition={{ delay: 0.2 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-brand-red" />
          </div>
          <h2 className="text-2xl font-bold text-brand-charcoal">The Problem</h2>
        </div>
        <Card className="border-surface-line/50">
          <CardContent className="pt-6 space-y-4">
            <p className="text-brand-brown/80">
              A modular home is often the most affordable route to ownership in rural Nova Scotia, but the
              price of the home is only part of the bill. A well, a septic system, a foundation, a driveway,
              and power to the lot can add{" "}
              <strong className="text-brand-charcoal">tens of thousands of dollars</strong> that most
              first-time buyers have never priced and do not know to ask about.
            </p>
            <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl p-4">
              <h4 className="font-semibold text-brand-red mb-2">What buyers could not see</h4>
              <ul className="text-sm space-y-1 text-brand-brown/80">
                <li>• What a drilled well or septic field costs on their kind of lot</li>
                <li>• How each upgrade changes the monthly payment, not just the total</li>
                <li>• Which features are already standard and which are true upgrades</li>
                <li>• A single number they could take to the dealer and the bank</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Key Decisions */}
      <motion.section {...fadeIn} transition={{ delay: 0.3 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-charcoal/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-brand-charcoal" />
          </div>
          <h2 className="text-2xl font-bold text-brand-charcoal">The Decisions That Shaped It</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-surface-line/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tell, don't ask</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-brand-brown/80">
              The first build used sliders for site costs. That assumed the buyer already knew the
              answers. It was rebuilt so the tool asks simple questions (well or municipal water? own
              land or buying?) and supplies the costs itself, with typical Nova Scotia ranges.
            </CardContent>
          </Card>
          <Card className="border-surface-line/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Real photos only</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-brand-brown/80">
              Generated drawings were tried and rejected because they undermined trust. The main visual is
              real photography, never tinted or edited, and every image carries its source and licence.
              Choices without an approved photo simply show the choice.
            </CardContent>
          </Card>
          <Card className="border-surface-line/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Never pass off an estimate as real</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-brand-brown/80">
              Until the dealer supplies verified data, lots are labelled as examples and prices as
              estimates. It makes the demo a little less impressive and a lot more honest, which is the
              right trade for a tool people will use to plan a mortgage.
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* What Shipped */}
      <motion.section {...fadeIn} transition={{ delay: 0.4 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-moss/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-brand-moss" />
          </div>
          <h2 className="text-2xl font-bold text-brand-charcoal">What Shipped</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {shipped.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="w-4 h-4 text-brand-copper" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">{body}</CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-brand-brown/70">
          Every stage was released only after lint, a full TypeScript check, a production build, and
          scripted checks passed.
        </p>
      </motion.section>

      {/* What's Next */}
      <motion.section {...fadeIn} transition={{ delay: 0.5 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-copper/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-brand-copper" />
          </div>
          <h2 className="text-2xl font-bold text-brand-charcoal">What's Next</h2>
        </div>
        <Card className="border-surface-line/50">
          <CardContent className="pt-6">
            <ul className="text-sm space-y-2 text-brand-brown/80">
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-brand-copper mt-0.5 shrink-0" />
                Swap in the dealer's real lots, model prices, and factory option price list as they arrive.
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-brand-copper mt-0.5 shrink-0" />
                Add the manufacturer's photography once written permission is in place, and close the
                remaining photo gaps the coverage report tracks.
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}

export default function GoldRiverCaseStudy() {
  return (
    <Layout>
      <GoldRiverContent />
    </Layout>
  );
}
