import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
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
            Building <span className="text-gradient">Intelligent</span> Systems
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            I'm a Full Stack Engineer obsessed with clean architecture, AI integration, 
            and crafting exceptional user experiences.
          </motion.p>
        </div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/portfolio">
            <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              View Work <Terminal className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/fit">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 rounded-xl bg-background border-2 hover:bg-muted/50">
              Check Fit <Sparkles className="ml-2 w-4 h-4 text-accent" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border w-full max-w-4xl opacity-50">
          {[
            ["5+", "Years Exp"],
            ["50+", "Projects"],
            ["100%", "Client Sat"],
            ["24/7", "AI Powered"],
          ].map(([stat, label]) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-2xl font-bold font-display">{stat}</span>
              <span className="text-sm uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
