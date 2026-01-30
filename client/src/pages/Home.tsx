import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useSiteCopy } from "@/lib/queryClient";
import { FileText, MessageSquare, BadgeCheck, ArrowRight } from "lucide-react";

const ICONS = [FileText, MessageSquare, BadgeCheck];

export default function Home() {
  const { data: site } = useSiteCopy();

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center pt-8 md:pt-12 space-y-6">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tighter text-brand-red"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {site?.tagline}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-brand-brown leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {site?.subtagline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/fit">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                data-testid="button-start-fit"
              >
                {site?.primaryCta} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <Link href="/resume">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base h-12 px-8 rounded-xl"
                data-testid="button-view-resume"
              >
                View Modular Resume
              </Button>
            </Link>
          </motion.div>

          {site && (
            <div className="text-sm text-surface-line space-y-1 pt-2">
              <p>{site.builtByLine}</p>
              <p>{site.privacyNote}</p>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {(site?.howItWorks || []).map((step: any, idx: number) => {
              const Icon = ICONS[idx] || FileText;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx }}
                >
                  <Card className="h-full rounded-2xl">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-charcoal flex items-center justify-center">
                          <Icon className="h-5 w-5 text-surface-paper" />
                        </div>
                        <h3 className="font-semibold text-lg leading-tight text-brand-brown">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-surface-line leading-relaxed">
                        {step.body}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
