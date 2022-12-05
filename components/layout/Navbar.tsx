import { Center, Navbar, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { IconCode, IconMusic, TablerIcon } from '@tabler/icons';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import { DarkToggler } from '../misc/DarkToggler';
import { LanguageBtn } from '../misc/LanguageBtn';

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  href: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, href, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" className='rounded-full'>
      <Link href={href}>
        <UnstyledButton
          onClick={onClick}
          className={classNames(
            'flex rounded-full justify-center items-center text-blue-600 dark:text-blue-200',
            'hover:bg-blue-100 dark:hover:bg-zinc-700',
            "aspect-square h-11 w-11 rounded-full transition-colors duration-default",
            active && 'bg-blue-100 dark:bg-zinc-700',
          )}
        >
          <Icon stroke={1.5} />
        </UnstyledButton>
      </Link>
    </Tooltip>
  );
}

const menu = [
  { icon: IconMusic, label: "Notemap", href: "/" },
  { icon: IconCode, label: "About", href: "/about" },
];

export function NavbarMini() {
  const [active, setActive] = useState(0);

  const links = menu.map((link, index) => (
    <div key={link.label} className='flex justify-center'>
      <NavbarLink
        {...link}
        active={index === active}
        onClick={() => setActive(index)}
      />
    </div>
  ));

  return (
    <Navbar width={{ base: 64 }} className='h-screen shadow-md py-4'>
      <Center>
        RootEx
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={8} className="overflow-visible">
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section mb={16}>
        <Stack justify="center" spacing={8} className="overflow-visible">
          <LanguageBtn />
          <DarkToggler />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}
