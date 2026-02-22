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
      {/* Spreadsheet-style tab bar */}
      <div className="border-b border-surface-line/60 -mx-4 px-4 md:-mx-8 md:px-8 mb-8">
        <div className="max-w-6xl mx-auto flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLocation(`/case-study/${tab.id}`)}
              className={`px-5 py-2.5 text-sm font-medium border border-b-0 transition-colors -mb-px ${
                activeTab.id === tab.id
                  ? "bg-surface-paper text-brand-copper border-surface-line/60 rounded-t-lg z-10"
                  : "bg-brand-stone/30 text-brand-brown/50 border-transparent hover:text-brand-brown/70 hover:bg-brand-stone/50 rounded-t-lg"
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
