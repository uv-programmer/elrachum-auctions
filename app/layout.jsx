import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/CookieBanner'
import PostHogProvider from '@/components/PostHogProvider'

export const metadata = {
  title: {
    default: 'El Rachum Auctions LLC',
    template: '%s | El Rachum Auctions LLC',
  },
  description:
    'Shop online auctions for liquidation goods, returned merchandise, and quality lots across Canada. Bid live on HiBid.',
  keywords: ['online auction', 'canada auction', 'liquidation', 'hibid', 'heritage auctions'],
  openGraph: {
    title: 'El Rachum Auctions LLC',
    description: 'Live online auctions — bid from anywhere in Canada.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
