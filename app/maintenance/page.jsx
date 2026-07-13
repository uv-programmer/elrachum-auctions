export const metadata = { title: 'Under Maintenance · El Rachum Auctions' }

export default function MaintenancePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: '#1a2744' }}
    >
      {/* Logo */}
      <img src="/logo.png" alt="El Rachum Auctions" className="w-20 h-20 object-contain rounded-xl mb-8"
        style={{ mixBlendMode: 'screen', filter: 'brightness(1.3)' }} />

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(176,124,32,0.15)', border: '1px solid rgba(176,124,32,0.3)' }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#b07c20" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: '#b07c20' }}>
        Maintenance Mode
      </p>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
        We'll Be Right <span style={{ color: '#b07c20' }}>Back</span>
      </h1>

      <p className="text-sm max-w-md mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
        El Rachum Auctions is currently undergoing scheduled maintenance. We'll be back online shortly — thank you for your patience.
      </p>

      {/* Separator */}
      <div className="w-16 h-px mb-8" style={{ background: 'rgba(176,124,32,0.3)' }} />

      {/* Contact */}
      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Need immediate assistance?</p>
      <a href="mailto:contact@elrachumauctions.com"
        className="text-sm font-medium hover:opacity-80 transition-opacity"
        style={{ color: '#b07c20' }}>
        contact@elrachumauctions.com
      </a>

      <p className="text-xs mt-8" style={{ color: 'rgba(255,255,255,0.15)' }}>
        Windsor, Ontario · Canada
      </p>
    </div>
  )
}
