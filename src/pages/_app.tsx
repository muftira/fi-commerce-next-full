import '@/styles/globals.scss';
import Head from 'next/head';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Fi Commerce</title>
        <meta name="description" content="title" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
