import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'
import { ExitModal } from '@/components/modals/exit-modal'

const font = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chen Lingo',
  description:
    'Chen Lingo is an innovative English language learning application designed to make the language acquisition journey enjoyable, effective, and interactive. With an array of captivating visuals and a playful interface, ChenLingo transforms the often daunting task of learning a new language into a delightful experience.',
  icons: {
    icon: '/site-logo.svg'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={font.className}>
          <Toaster />
          <ExitModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
