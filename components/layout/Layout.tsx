import { Burger } from '@mantine/core';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { Asidebar } from './Asidebar';
import { NavbarMini } from './Navbar';

export default function Layout({ children }: {
  children: ReactNode,
}) {
  const [opened, setOpened] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const closeNav = () => setOpened(false)
    router.events.on("routeChangeComplete", closeNav)
    return () => {
      router.events.off("routeChangeComplete", closeNav)
    }
  }, [router.events])

  return (
    <>
      <div className='px-4 lg:pl-16'>
        <div className='fixed top-0 left-0 z-[88] w-[42px] h-[42px] flex rounded-full justify-center items-center bg-blue-100/70 dark:bg-zinc-700/70 lg:hidden'>
          <Burger
            opened={opened}
            onClick={() => setOpened(o => !o)}
            size="sm"
          />
        </div>
        <nav className='fixed top-0 bottom-0 left-0 z-[66]'>
          <NavbarMini className='hidden lg:flex' />
          <Asidebar opened={opened} className='transition-[width] ease-in-out duration-300 lg:hidden' />
        </nav>
        <main className='h-screen'>
          {children}
        </main>
      </div>
    </>
  )
}
