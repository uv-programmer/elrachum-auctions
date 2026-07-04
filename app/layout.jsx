import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/CookieBanner'
import PostHogProvider from '@/components/PostHogProvider'

export const metadata = {
  title: {
    default: 'El Rachum Auctions LLC | Online Auction Windsor Ontario',
    template: '%s | El Rachum Auctions LLC',
  },
  description:
    'El Rachum Auctions LLC — online auction house in Windsor, Ontario. Bid live on liquidation lots, furniture, electronics & more. Register free on HiBid. Pickup Tue, Thu & Sat.',
  keywords: [
    'online auction Windsor Ontario',
    'auction house Windsor Canada',
    'liquidation auction Ontario',
    'HiBid auction Windsor',
    'online auction Canada',
    'El Rachum Auctions',
    'auction lots Windsor',
    'buy auction items Ontario',
    'liquidation lots Canada',
    'pickup auction Windsor',
  ],
  authors: [{ name: 'El Rachum Auctions LLC' }],
  creator: 'El Rachum Auctions LLC',
  metadataBase: new URL('https://elrachumauctions.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'El Rachum Auctions LLC | Online Auction Windsor Ontario',
    description: 'Live online auctions in Windsor, Ontario — bid from anywhere in Canada. Liquidation lots, furniture, electronics & more on HiBid.',
    url: 'https://elrachumauctions.com',
    siteName: 'El Rachum Auctions LLC',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Rachum Auctions LLC | Windsor Ontario',
    description: 'Live online auctions — bid from anywhere in Canada.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    // google: 'ADD_YOUR_GOOGLE_SEARCH_CONSOLE_CODE_HERE',
  },
}

// JSON-LD structured data — tells Google this is a local business
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'El Rachum Auctions LLC',
  description: 'Online auction house specializing in liquidation merchandise, furniture, electronics, and quality lots. Bid live on HiBid.',
  url: 'https://elrachumauctions.com',
  telephone: '+15199823332',
  email: 'contact@elrachumauctions.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2825 County Road 42',
    addressLocality: 'Windsor',
    addressRegion: 'ON',
    postalCode: 'N8V 0A4',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 42.2749,
    longitude: -82.9816,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Thursday'], opens: '11:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00' },
  ],
  sameAs: [
    'https://www.facebook.com/elrachumauctions',
    'https://www.instagram.com/elrachumauctions',
  ],
  priceRange: '$',
  currenciesAccepted: 'CAD',
  paymentAccepted: 'Cash, Credit Card, Interac e-Transfer',
  areaServed: {
    '@type': 'Country',
    name: 'Canada',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-CA">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <PostHogProvider>
          <Navbar />
          <main className="flex-1 pt-[68px]">{children}</main>
          <Footer />
          <CookieBanner />
        </PostHogProvider>
      </body>
    </html>
  )
}
