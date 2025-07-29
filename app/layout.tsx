import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Nova',
  description: 'Click, watch, enjoy. Nova breaks down the paywall, ensuring that quality content is accessible to everyone.',
  keywords: 'free movies, free streaming, watch movies online, free tv shows, streaming service, watch movies free, online streaming, novastream, free movies online, free series online',
  openGraph: {
    title: 'Nova - Watch Movies & TV Shows',
    description: 'Click, watch, enjoy. Nova breaks down the paywall, ensuring that quality content is accessible to everyone.',
    url: 'https://novastream.top',
    images: [
      {
        url: 'https://raw.githubusercontent.com/ambr0sial/nova/main/logo.png',
        width: 300,
        height: 300,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Nova - Watch Movies & TV Shows',
    description: 'Click, watch, enjoy. Nova breaks down the paywall, ensuring that quality content is accessible to everyone.',
    images: ['https://raw.githubusercontent.com/ambr0sial/nova/main/logo.png'],
  },
  icons: {
    icon: 'https://raw.githubusercontent.com/ambr0sial/nova/main/logo.png',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-900 text-white min-h-screen font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
