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
      <div className="space-y-16 md:space-y-24">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center py-8 md:py-16 space-y-8">
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-brand-red"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {site?.tagline}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-brand-brown leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {site?.subtagline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/fit">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base font-semibold h-14 px-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                data-testid="button-start-fit"
              >
                {site?.primaryCta} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/resume">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-semibold h-14 px-10 rounded-xl border-2 hover:border-brand-copper transition-all duration-200"
                data-testid="button-view-resume"
              >
                View Modular Resume
              </Button>
            </Link>
          </motion.div>

          {site && (
            <motion.div
              className="text-sm text-surface-line space-y-1 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p>{site.builtByLine}</p>
              <p>{site.privacyNote}</p>
            </motion.div>
          )}
        </div>

        {/* How it works */}
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-brand-charcoal text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {(site?.howItWorks || []).map((step: any, idx: number) => {
              const Icon = ICONS[idx] || FileText;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * idx }}
                >
                  <Card className="h-full rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6 md:p-8 space-y-4">
                      <div className="h-12 w-12 rounded-xl bg-brand-copper/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-brand-copper" />
                      </div>
                      <h3 className="font-semibold text-xl leading-tight text-brand-charcoal">
                        {step.title}
                      </h3>
                      <p className="text-brand-brown/80 leading-relaxed">
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
