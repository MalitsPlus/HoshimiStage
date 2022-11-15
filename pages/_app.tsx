import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { ColorScheme, ColorSchemeProvider, MantineProvider, Tuple } from '@mantine/core';
import { IPR_THEME } from '../src/theme';
import { useState } from 'react';
import tailwindColors from "tailwindcss/colors"
import { stringify } from 'querystring';
import Layout from '../components/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) => {
    colorScheme === 'dark'
      ? document.documentElement.classList.remove('dark')
      : document.documentElement.classList.add('dark')
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
  }
  return (
    <>
      <Head>
        <title>Sakura-Love(kari)</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: colorScheme,
            colors: {
              ipr: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e',],
              twsky: Object.values(tailwindColors.sky) as [],
            },
            primaryColor: "twsky",
            primaryShade: { light: 5, dark: 6 },
            activeStyles: {
              transform: "none",
            },
            components: {
              Button: {
                defaultProps: {
                },
                classNames: {
                  root: "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700 dark:active:bg-sky-800 transition duration-150"
                },
              },
            }
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  )
}
