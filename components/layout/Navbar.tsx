import { Center, Navbar, Space, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { IconMusic, IconQuestionCircle, IconSearch, TablerIcon } from '@tabler/icons';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DarkToggler } from '../misc/DarkToggler';
import { LanguageBtn } from '../misc/LanguageBtn';
import { Pages } from '../../data/pages';
import { t } from 'i18next';

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  href: string;
  active?: boolean;
  onClick?(): void;
}

// const RefLink = forwardRef<
//   HTMLAnchorElement,
//   Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>
//   & LinkProps
//   & {
//     children?: React.ReactNode;
//   }
//   & React.RefAttributes<HTMLAnchorElement>
// >((props, ref) => (
//   <Link ref={ref} {...props} />
// ))
// RefLink.displayName = "RefLink"

function NavbarLink({ icon: Icon, label, href, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={t(label)} position="right" className='rounded-full'>
      <div>
        <Link href={href} passHref legacyBehavior>
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
      </div>
    </Tooltip>
  );
}

export function NavbarMini({
  className,
}: {
  className?: string,
}) {
  const router = useRouter()
  const [active, setActive] = useState(Pages.findIndex(x => x.href === router.pathname))

  const links = Pages.map((link, index) => (
    <div key={link.label} className='flex justify-center'>
      <NavbarLink
        {...link}
        active={index === active}
        onClick={() => setActive(index)}
      />
    </div>
  ))

  return (
    <Navbar
      width={{ base: 64 }}
      className={`h-screen shadow-md py-4 ${className}`}
    >
      <Center>
        <Image src="/svg/hoshimi-production-logo.svg" alt="logo" width={44} height={30} />
      </Center>
      <Space h={4} />
      <Center>
        <Image src="/svg/hoshimi-production-name.svg" alt="logo" width={44} height={6} />
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
