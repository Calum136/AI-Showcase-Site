import { Layout } from "@/components/Layout";
import { useReferences } from "@/hooks/use-content";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";

export default function References() {
  const { data: references, isLoading, error } = useReferences();

  if (isLoading) {
    return (
      <Layout>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-64 rounded-2xl" />
          ))}
        </div>
      </Layout>
    );
  }

  if (error || !references) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-destructive">Failed to load references</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold font-display mb-4">What People Say</h1>
          <p className="text-muted-foreground">
            Feedback from colleagues, clients, and mentors I've had the privilege to work with.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {references.map((ref) => (
            <Card key={ref.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4 text-primary/10">
                <Quote className="w-16 h-16" />
              </div>
              
              <CardContent className="pt-8 flex flex-col h-full">
                <p className="text-foreground/80 italic mb-8 flex-grow leading-relaxed">
                  "{ref.quote}"
                </p>
                
                <div className="border-t border-border pt-4 mt-auto">
                  <h3 className="font-bold font-display text-lg">{ref.name}</h3>
                  <p className="text-primary text-sm font-medium">{ref.title} at {ref.company}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{ref.relationship}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
