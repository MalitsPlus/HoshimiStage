import { HoverCard, SegmentedControl, UnstyledButton } from '@mantine/core';
import Image from 'next/image';
import { useContext } from 'react';
import { AppContext } from '../../pages/_app';

export function LanguageBtn() {
  const { lng, onLanguageChange } = useContext(AppContext)
  return (
    <div className='flex justify-center'>
      <HoverCard position="right" withArrow shadow="md" closeDelay={400}>
        <HoverCard.Target>
          <UnstyledButton
            className="flex rounded-full justify-center items-center aspect-square h-11 w-11 transition-colors duration-default
              bg-transparent
              text-blue-600  hover:bg-blue-100 active:bg-blue-200
              dark:text-blue-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-600"
          >
            {lng === "en" ? <Image src="/svg/us.svg" alt="us" width={20} height={20} className="rounded-md" />
              : <Image src="/svg/cn.svg" alt="cn" width={20} height={20} className="rounded-md" />}
          </UnstyledButton>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <SegmentedControl
            value={lng}
            onChange={(value) => onLanguageChange(value)}
            data={[
              {
                value: "en",
                label: (
                  <Image src="/svg/us.svg" alt="us" width={20} height={20} className="rounded-md" />
                ),
              },
              {
                value: "zh",
                label: (
                  <Image src="/svg/cn.svg" alt="zh" width={20} height={20} className="rounded-md" />
                ),
              },
            ]}
          />
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
}
