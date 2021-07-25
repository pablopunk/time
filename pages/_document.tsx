import { Main, NextScript, Html, Head } from 'next/document'

export default function MyDocument() {
  return (
    <Html>
      <Head>
        <script data-goatcounter="/goat" async src="/count.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
