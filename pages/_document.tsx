import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const META_TITLE = "Hoshimi Stage"
const META_DESCRIPTION = "Live simulation application for IDOLY PRIDE"
const BASEURL = "https://hoshimi-stage.vercel.app"
const OG_IMAGE = ""
let colorScheme: "light" | "dark" = "dark"

const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
  static getInitialProps = getInitialProps

  render() {
    return (
      // <Html>
      <Html className={colorScheme}>
        <Head>
          <meta property="og:title" content={META_TITLE} />
          <meta property="twitter:title" content={META_TITLE} />
          <meta property="og:url" content={BASEURL} />
          <meta property="twitter:url" content={BASEURL} />
          <meta name="description" content={META_DESCRIPTION} />
          <meta property="og:description" content={META_DESCRIPTION} />
          <meta property="twitter:description" content={META_DESCRIPTION} />
          <meta property="og:image" content={OG_IMAGE} />
          <meta property="og:image:alt" content={META_DESCRIPTION} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="600" />
          <meta property="og:site_name" content={META_TITLE} />
          <meta property="og:type" content="website" />

          <meta name="twitter:image:src" content={OG_IMAGE} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}