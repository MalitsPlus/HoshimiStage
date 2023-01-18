import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createContext, useState } from 'react';
import tailwindColors from "tailwindcss/colors";
import Layout from '../components/layout/Layout';
import { default as i18n } from '../src/i18n';
import '../styles/globals.css';

const defaultLang = "en"

export const AppContext = createContext({
  lng: defaultLang,
  onLanguageChange: (nl: string) => { },
})

export default function App({ Component, pageProps }: AppProps) {
  const [lang, setLang] = useState(defaultLang)

  const appContext = {
    lng: lang,
    onLanguageChange: (nl: string) => {
      setLang(nl)
      i18n.changeLanguage(nl)
    }
  }

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
        <title>Hoshimi Stage</title>
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
              // transform: "none",
            },
            components: {
              // Button: {
              //   defaultProps: {
              //   },
              //   classNames: {
              //     root: "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700 dark:active:bg-sky-800 transition duration-150"
              //   },
              // },
            }
          }}
        >
          <AppContext.Provider value={appContext}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AppContext.Provider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  )
}
