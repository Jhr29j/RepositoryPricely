import type { Metadata } from 'next'
import '../styles/theme.css'
import Navbar from '@/components/Navbar'
import AppLayout from '@/components/Layout'

export const metadata: Metadata = {
  title:       'Pricely – Compara precios en RD',
  description: 'Compara precios de productos en los supermercados de República Dominicana.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppLayout>
          <Navbar />
          <main>{children}</main>
        </AppLayout>
      </body>
    </html>
  )
}