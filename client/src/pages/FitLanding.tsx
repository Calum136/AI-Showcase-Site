import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MessageSquare, User, ArrowRight, Target, Clock, Zap } from "lucide-react";

export default function FitLanding() {
  const scrollToFooter = () => {
    const footer = document.querySelector("footer");
    footer?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 md:py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-red"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Fit Lab Diagnostic
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-brand-brown leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find Your Operational Leverage
          </motion.p>

          <motion.p
            className="text-brand-brown/80 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            An 8-minute conversation that surfaces bottlenecks and improvement
            opportunities in your organization.
          </motion.p>
        </div>

        {/* Two-Path Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Business Challenge Card */}
          <Card className="group rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <Link href="/fit/chat">
              <CardContent className="p-8 space-y-6 h-full">
                <div className="h-14 w-14 rounded-xl bg-brand-copper/10 flex items-center justify-center group-hover:bg-brand-copper/20 transition-colors">
                  <MessageSquare className="h-7 w-7 text-brand-copper" />
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-xl text-brand-charcoal">
                    I have a business or role challenge
                  </h3>
                  <p className="text-brand-brown/80 leading-relaxed">
                    Start a diagnostic conversation to identify where leverage lives
                    in your organization and what's blocking flow.
                  </p>
                </div>

                <Button className="w-full rounded-xl h-12 text-base font-medium group-hover:shadow-md transition-all">
                  Start Diagnostic
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Personal Connection Card */}
          <Card
            className="group rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={scrollToFooter}
          >
            <CardContent className="p-8 space-y-6 h-full">
              <div className="h-14 w-14 rounded-xl bg-brand-moss/10 flex items-center justify-center group-hover:bg-brand-moss/20 transition-colors">
                <User className="h-7 w-7 text-brand-moss" />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-xl text-brand-charcoal">
                  I want to connect with Calum
                </h3>
                <p className="text-brand-brown/80 leading-relaxed">
                  Reach out directly via email, phone, or LinkedIn to discuss
                  opportunities, collaborations, or just say hello.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl h-12 text-base font-medium border-2 group-hover:border-brand-copper transition-all"
              >
                View Contact Info
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* What to Expect */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-brand-charcoal text-center mb-8">
            What to Expect
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-xl bg-brand-stone flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-brand-brown" />
              </div>
              <h4 className="font-medium text-brand-charcoal">8-12 Exchanges</h4>
              <p className="text-sm text-brand-brown/80">
                A focused conversation, not an interrogation
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-xl bg-brand-stone flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-brand-brown" />
              </div>
              <h4 className="font-medium text-brand-charcoal">Systems Focus</h4>
              <p className="text-sm text-brand-brown/80">
                We diagnose bottlenecks, not symptoms
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-xl bg-brand-stone flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-brand-brown" />
              </div>
              <h4 className="font-medium text-brand-charcoal">FitReport</h4>
              <p className="text-sm text-brand-brown/80">
                Actionable insights on operational leverage
              </p>
            </div>
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.p
          className="text-center text-sm text-surface-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Nothing is stored. Session data is discarded after the conversation ends.
        </motion.p>
      </div>
    </Layout>
  );
}
