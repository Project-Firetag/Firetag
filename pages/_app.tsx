import Head from 'next/head'
import { useEffect } from 'react'
import Header from '../elements/header'
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.getElementsByTagName("html")[0].style.backgroundColor = "#161c24"
  }, [])
  const title: string = Component.title ?? null;
  return (
    <>
      <Head>
        <meta name="theme-color" content={"#161c24"} />
        {title && <title>{title}</title>}
      </Head>
      <Header/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
