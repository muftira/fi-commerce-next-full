import '@/styles/globals.scss';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import Providers from './providers';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Fi Commerce</title>
        <meta name="description" content="title" />
      </Head>
      <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </Providers>
    </>
  );
}
