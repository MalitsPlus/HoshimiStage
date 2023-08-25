import Image from 'next/image';
import { Pages } from '../../data/pages';
import Link from 'next/link';
import { UnstyledButton } from '@mantine/core';
import { LanguageBtn } from '../misc/LanguageBtn';
import { DarkToggler } from '../misc/DarkToggler';

export function Asidebar({
  opened,
  className,
}: {
  opened: boolean,
  className?: string,
}) {
  return (
    <aside
      className={`flex flex-col items-stretch text-center h-screen overflow-hidden ${opened ? "w-screen" : "w-0"} bg-zinc-50 dark:bg-zinc-800 ${className}`}>
      <div className='self-center py-8'>
        <Image src="/svg/hoshimi-production-logo.svg" alt="logo" width={88} height={60} />
        <Image src="/svg/hoshimi-production-name.svg" alt="logo" width={88} height={12} />
      </div>
      <div className='grow flex flex-col py-4 space-y-8'>
        {Pages.map(menu => (
          <div key={menu.label}>
            <Link href={menu.href} passHref legacyBehavior>
              <UnstyledButton
                onClick={() => { }}
              >
                <div className='flex justify-center items-center gap-1 text-2xl'>
                  <menu.icon size={36} stroke={1.5} />
                  {menu.label}
                </div>
              </UnstyledButton>
            </Link>
          </div>
        ))}
      </div>
      <div className='pt-4 pb-12 space-y-8'>
        <LanguageBtn />
        <DarkToggler />
      </div>
    </aside>
  )
}