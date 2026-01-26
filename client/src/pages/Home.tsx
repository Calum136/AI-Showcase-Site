import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteCopy } from "@/lib/queryClient";
export default function Home() {
  const { data: site } = useSiteCopy();
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-xl animate-pulse" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-2xl overflow-hidden">
            {/* Unsplash image of a developer coding at a modern desk */}
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <div className="space-y-4 max-w-2xl">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {site?.tagline}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {site?.subtagline}
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/portfolio">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base h-12 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {site?.primaryCta} <Terminal className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/fit">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base h-12 px-8 rounded-xl bg-background border-2 hover:bg-muted/50"
            >
              Check Fit <Sparkles className="ml-2 w-4 h-4 text-accent" />
            </Button>
            {site && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{site.builtByLine}</p>
                <p>{site.privacyNote}</p>
              </div>
            )}
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
