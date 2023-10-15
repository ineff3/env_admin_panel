import './globals.css'
import { Open_Sans } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'


const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Env Admin',
  description: 'Admin panel',
}

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster position='top-right' />
      </body>
    </html>
  )
}
