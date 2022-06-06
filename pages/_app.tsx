import Head from 'next/head'
import { useEffect } from 'react'
import Header from '../elements/header'
import "../styles/globals.css";
import "../styles/z-index.css";
import NextProgress from "next-progress";
import {RecoilRoot} from "recoil";
import Loading from '../elements/views/loading';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.getElementsByTagName("html")[0].style.backgroundColor = "#161c24"
  }, [])
  const title: string = Component.title ?? null;
  const transparent = Boolean(Component.transparent)
  return (
    <>
      <Head>
        <meta name="theme-color" content={"#161c24"} />
        <link rel='manifest' href='/manifest.json' />
        <meta name='mobile-web-app-capable' content='yes' />
        {title && <title>{title}</title>}
      </Head>
      <NextProgress delay={0} options={{ showSpinner: false }} />
      <Header transparent={transparent}/>
      <RecoilRoot>
        <Loading/>
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  )
}

export default MyApp
