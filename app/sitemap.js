export default function sitemap() {
  const base = 'https://elrachumauctions.com'
  const now = new Date()

  return [
    { url: base,                    lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/auctions`,      lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/book-pickup`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/about`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/faq`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/careers`,       lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
