import { useMantineColorScheme, UnstyledButton } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';

export function DarkToggler() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <div className='flex justify-center'>
      <UnstyledButton
        onClick={() => {
          // https://github.com/tailwindlabs/tailwindcss/discussions/9769
          document.documentElement.classList.add('[&_*]:!duration-0')
          toggleColorScheme()
          requestAnimationFrame(() => {
            document.documentElement.classList.remove('[&_*]:!duration-0')
          })
        }}
        className="flex aspect-square h-11 w-11 justify-center items-center rounded-full bg-transparent duration-default
          hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
        })}
      >
        {colorScheme === 'dark' ? <IconSun /> : <IconMoonStars />}
      </UnstyledButton>
    </div>
  );
}
