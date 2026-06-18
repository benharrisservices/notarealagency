// Central brand + site configuration. Rename the platform in one place here.
export const siteConfig = {
  name: "NARA Real Estate",
  wordmark: "NARA",
  legalName: "NARA Real Estate",
  tagline: "Not A Real Agency",
  description:
    "NARA is a London property opportunities platform — a curated index of residential, development, commercial and off-market opportunities, with the intelligence to act on them.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@nara.london",
  phone: "+44 (0)20 3667 2100",
  phoneHref: "tel:+442036672100",
  address: {
    line1: "Studio 4, Dock House",
    line2: "Cable Street",
    city: "London",
    postcode: "E1 0AE",
    country: "GB",
  },
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  primaryNav: [
    { label: "Opportunities", href: "/properties" },
    { label: "Map", href: "/map" },
    { label: "Areas", href: "/areas" },
    { label: "Sell", href: "/sell" },
    { label: "Lettings", href: "/lettings" },
    { label: "Insights", href: "/insights" },
    { label: "About", href: "/about" },
  ],
  footerNav: [
    {
      heading: "Opportunities",
      links: [
        { label: "All opportunities", href: "/properties" },
        { label: "Residential", href: "/properties?transaction=SALE" },
        { label: "To let", href: "/properties?transaction=LETTING" },
        { label: "Map search", href: "/map" },
        { label: "Area guides", href: "/areas" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Sell or list with us", href: "/sell" },
        { label: "Lettings & management", href: "/lettings" },
        { label: "Request a valuation", href: "/valuation" },
        { label: "Insights", href: "/insights" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About NARA", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Saved", href: "/saved" },
        { label: "Admin", href: "/admin" },
      ],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
