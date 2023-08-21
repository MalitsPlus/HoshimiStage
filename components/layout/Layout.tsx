import { ReactNode } from 'react'
import { NavbarMini } from './Navbar'

export default function Layout({ children }: {
  children: ReactNode,
}) {
  return (
    <>
      <div className='pl-16'>
        <nav className='fixed top-0 bottom-0 left-0 z-30'>
          <NavbarMini />
        </nav>
        <main className='h-screen'>
          {children}
        </main>
      </div>
    </>
  )
}
