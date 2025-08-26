import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import LoadingBar from '@/components/LoadingBar'

export const metadata: Metadata = {
  title: 'Miko',
  description: 'Click, watch, enjoy. Miko breaks down the paywall, ensuring that quality content is accessible to everyone.',
  keywords: 'free movies, free streaming, watch movies online, free tv shows, streaming service, watch movies free, online streaming, miko stream, free movies online, free series online',
  openGraph: {
    title: 'Miko - Watch Movies & TV Shows',
    description: 'Click, watch, enjoy. Miko breaks down the paywall, ensuring that quality content is accessible to everyone.',
    url: 'https://miko-stream.app',
    images: [
      {
        url: '/logo.png',
        width: 300,
        height: 300,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Miko - Watch Movies & TV Shows',
    description: 'Click, watch, enjoy. Miko breaks down the paywall, ensuring that quality content is accessible to everyone.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HGL07M90WG"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HGL07M90WG');
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=0.9" />
        <meta name="theme-color" content="#A17FC0" />
  {/* PWA manifest and icons */}
  <link rel="manifest" href="/manifest.json" />
  <link rel="apple-touch-icon" href="/logo.png" />
  <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Service worker registration: allow localhost (HTTP) and HTTPS origins */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
              const isHttps = location.protocol === 'https:';
              if (!isLocalhost && !isHttps) return;
              navigator.serviceWorker.register('/sw.js').then(function(reg) {
                console.log('Service worker registered.', reg);
              }).catch(function(err) {
                console.warn('Service worker registration failed:', err);
              });
            });
          }
        ` }} />
      </head>
  <body className="miko-bg text-white min-h-screen font-sans">
        <LoadingBar />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
