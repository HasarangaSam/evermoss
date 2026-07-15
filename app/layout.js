import "./globals.css";
import "./enhancements.css";
import "./floral.css";
import "./admin-products.css";

export const metadata = {
  metadataBase: new URL("https://evermoss.vercel.app"),

  title: {
    default: "Evermoss | For the love of green spaces",
    template: "%s | Evermoss",
  },

  description:
    "Evermoss creates beautiful artificial flower arrangements, home decor pieces, and thoughtful gifts designed to bring timeless beauty into every space.",

  keywords: [
    "Evermoss",
    "artificial flowers Sri Lanka",
    "flower arrangements Sri Lanka",
    "home decor Sri Lanka",
    "flower gifts Sri Lanka",
    "Gampaha flower shop",
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

    title: "Evermoss | Beautiful Green Spaces & Flower Arrangements",

    description:
      "Thoughtfully handcrafted flower arrangements and elegant decor pieces from Evermoss.",

    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "Evermoss Flower Collection",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Evermoss | Beautiful Green Spaces & Flower Arrangements",

    description:
      "Discover handcrafted flower arrangements and decorative pieces from Evermoss.",

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
