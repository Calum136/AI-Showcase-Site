export const SOFTWARE_STACK_CATEGORIES = {
  "POS / Booking": ["Square", "Toast", "Mindbody", "Shopify", "OpenTable"],
  "Communication": ["Gmail", "Outlook", "Slack", "WhatsApp Business"],
  "Scheduling": ["Calendly", "Acuity", "Google Calendar"],
  "Accounting": ["QuickBooks", "Wave", "Xero", "FreshBooks"],
  "Inventory / Ops": ["Airtable", "Notion", "Google Sheets", "Excel"],
  "CRM": ["HubSpot", "Salesforce", "Zoho"],
} as const;

export type SoftwareCategory = keyof typeof SOFTWARE_STACK_CATEGORIES;

export const ALL_SOFTWARE_OPTIONS = Object.values(SOFTWARE_STACK_CATEGORIES).flat();

// Industry-specific tools that appear dynamically based on selected industry
export const INDUSTRY_SPECIFIC_TOOLS: Record<string, readonly string[]> = {
  "Healthcare": ["Epic", "Cerner", "Athenahealth", "PioneerRx", "McKesson", "Practice Fusion", "DrChrono"],
  "Hospitality": ["7shifts", "Lightspeed Restaurant", "Resy", "Gusto", "TouchBistro", "Clover"],
  "Trades": ["ServiceTitan", "Jobber", "Housecall Pro", "Procore", "BuilderTrend"],
  "Retail": ["Lightspeed POS", "Clover", "Cin7", "Vend", "NetSuite"],
  "Professional Services": ["Clio", "Timely", "PracticePanther", "MyCase", "Kareo"],
};

export const INDUSTRY_OPTIONS = [
  "Hospitality",
  "Trades",
  "Retail",
  "Healthcare",
  "Professional Services",
  "Other",
] as const;

export type Industry = (typeof INDUSTRY_OPTIONS)[number];
