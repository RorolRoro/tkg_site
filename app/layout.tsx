import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import AuthSessionProvider from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Tokyo Ghoul RP - FOC',
  description: 'Plongez dans l\'univers sombre et immersif de Tokyo Ghoul. Rejoignez notre communauté de roleplay et vivez des aventures épiques dans les rues de Tokyo.',
  keywords: 'Tokyo Ghoul, Roleplay, RP, Discord, Community, Anime, Manga',
  authors: [{ name: 'Tokyo Ghoul RP Team' }],
  openGraph: {
    title: 'Tokyo Ghoul RP - FOC',
    description: 'Plongez dans l\'univers sombre et immersif de Tokyo Ghoul. Rejoignez notre communauté de roleplay.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthSessionProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
