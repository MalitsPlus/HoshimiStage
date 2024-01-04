import { HoverCard, SegmentedControl, UnstyledButton } from '@mantine/core';
import { useContext } from 'react';
import { AppContext } from '../../pages/_app';

export function LanguageBtn() {
  const { lng, onLanguageChange } = useContext(AppContext)
  const lngDict: { [k: string]: string } = {
    "en": "EN",
    "zh": "ZH",
    "ko": "KO",
  }
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
            {lngDict[lng]}
          </UnstyledButton>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <SegmentedControl
            value={lng}
            onChange={(value) => {
              onLanguageChange(value)
              window?.umami?.track("change language", { newLang: value })
            }}
            data={[
              {
                value: "en",
                label: ("EN"),
              },
              {
                value: "zh",
                label: ("ZH"),
              },
              {
                value: "ko",
                label: ("KO"),
              },
            ]}
          />
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
}
