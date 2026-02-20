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

export const INDUSTRY_OPTIONS = [
  "Hospitality",
  "Trades",
  "Retail",
  "Healthcare",
  "Professional Services",
  "Other",
] as const;

export type Industry = (typeof INDUSTRY_OPTIONS)[number];
