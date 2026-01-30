import { Layout } from "@/components/Layout";
import { usePortfolio } from "@/hooks/use-content";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Portfolio() {
  const { data: items, isLoading, error } = usePortfolio();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-96 rounded-2xl bg-surface-line/30" />
          ))}
        </div>
      </Layout>
    );
  }

  if (error || !items) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-brand-red">Failed to load portfolio</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold font-display mb-4 text-brand-red">Selected Work</h1>
          <p className="text-brand-brown">
            A collection of projects exploring the intersection of design, engineering, and artificial intelligence.
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {items.map((project) => (
            <motion.div key={project.id} variants={itemAnim}>
              <Card className="h-full flex flex-col overflow-hidden group">
                <div className="h-56 bg-brand-charcoal overflow-hidden relative">
                  <img
                    src={project.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-ink to-transparent opacity-60" />
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-display text-brand-brown">{project.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <CardDescription className="text-base leading-relaxed text-brand-brown/70">
                    {project.description}
                  </CardDescription>
                </CardContent>

                <CardFooter className="pt-4 border-t border-surface-line">
                  {project.link && (
                    <Button className="w-full rounded-xl gap-2" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
