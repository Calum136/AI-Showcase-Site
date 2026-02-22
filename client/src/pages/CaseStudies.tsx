import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { JollyTailsContent } from "@/pages/CaseStudy";
import { BlackbirdContent } from "@/pages/BlackbirdCaseStudy";
import { MaritimeHomeMapContent } from "@/pages/MaritimeHomeMapCaseStudy";

const TABS = [
  { id: "blackbird-brewing", label: "Blackbird Brewing", content: BlackbirdContent },
  { id: "maritime-home-map", label: "Maritime Home Map", content: MaritimeHomeMapContent },
  { id: "jollytails", label: "JollyTails", content: JollyTailsContent },
] as const;

export default function CaseStudies() {
  const [location, setLocation] = useLocation();

  // Extract slug from URL, default to first tab
  const slug = location.replace("/case-study/", "").replace("/case-study", "");
  const activeTab = TABS.find((t) => t.id === slug) || TABS[0];
  const ActiveContent = activeTab.content;

  return (
    <Layout>
      {/* Tab bar */}
      <div className="sticky top-16 z-20 bg-surface-paper/95 backdrop-blur-sm border-b border-surface-line/40 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="max-w-6xl mx-auto flex gap-1 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLocation(`/case-study/${tab.id}`)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab.id === tab.id
                  ? "bg-brand-copper text-surface-paper"
                  : "text-brand-brown/60 hover:text-brand-brown hover:bg-brand-stone/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ActiveContent />
    </Layout>
  );
}
