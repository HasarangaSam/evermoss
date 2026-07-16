import "./globals.css";
import "./enhancements.css";
import "./floral.css";
import "./admin-products.css";

export const metadata = {
  metadataBase: new URL("https://evermoss.com.lk"),

  title: {
    default:
      "Evermoss | Handcrafted Artificial Flower & Plant Arrangements Sri Lanka",
    template: "%s | Evermoss",
  },

  description:
    "Evermoss creates handcrafted artificial flower and plant arrangements in Sri Lanka. Explore elegant home decor pieces, custom designs, and thoughtful gifts made to bring beauty, greenery, and warmth to your space.",

  keywords: [
    "Evermoss",
    "artificial flowers Sri Lanka",
    "artificial plants Sri Lanka",
    "handcrafted flower arrangements Sri Lanka",
    "custom flower arrangements Sri Lanka",
    "home decor gifts Sri Lanka",
    "office decor Sri Lanka",
    "cafe decoration Sri Lanka",
    "Gampaha artificial flowers",
    "flower gifts Sri Lanka",
  ],

  authors: [
    {
      name: "Evermoss",
    },
  ],

  creator: "Evermoss",

  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "Evermoss",

    title: "Evermoss | Handcrafted Artificial Flower & Plant Arrangements",

    description:
      "Discover beautiful handcrafted artificial flower and plant arrangements, custom designs, and elegant decor pieces created to add warmth and greenery to your favourite spaces.",

    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "Evermoss handcrafted artificial flower and plant arrangements",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Evermoss | Handcrafted Artificial Flower & Plant Arrangements",

    description:
      "Explore elegant artificial flower arrangements, custom designs, and home decor gifts from Evermoss Sri Lanka.",

    images: ["/favicon.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          "--font-serif": "Georgia, 'Times New Roman', serif",
          "--font-sans": "Arial, Helvetica, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
