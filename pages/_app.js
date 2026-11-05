import { useEffect } from "react"
import Head from "next/head"
import "../styles/globals.css"

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ""

export default function App({ Component, pageProps }) {
    // Registra o service worker (app offline) só na versão publicada
    useEffect(() => {
        if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
            navigator.serviceWorker.register(`${BASE}/sw.js`).catch(() => {})
        }
    }, [])

    return (
        <>
            <Head>
                <title>Rolador de D20</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="theme-color" content="#5a2c14" />
                <meta name="description" content="Rolador de D20 para RPG, com vantagem e desvantagem" />
                <link rel="manifest" href={`${BASE}/manifest.webmanifest`} />
                <link rel="icon" href={`${BASE}/favicon.png`} />
                <link rel="apple-touch-icon" href={`${BASE}/icons/apple-touch-icon.png`} />
            </Head>
            <Component {...pageProps} />
        </>
    )
}
