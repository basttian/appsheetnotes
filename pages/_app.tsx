import AdminLoadingSkeleton from "../components/skeleton"
import '../styles/Css.module.css'
import type { AppProps } from 'next/app'
import { useSession } from "next-auth/react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

type AppPropsWithSession = AppProps & {
  Component: Session
}

export default function App({
  Component,
  pageProps,
}: AppPropsWithSession) {
  return (
    <SessionProvider>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  )
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true })

  if (status === "loading") {
    return <AdminLoadingSkeleton />
  }
  return children
}
