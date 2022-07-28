import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

import { fetcher, apiEndpoints } from './api'

export function useUser () {
  const { data, error, mutate } = useSWR(apiEndpoints.ACCOUNT_METADATA, fetcher)
  const router = useRouter()

  const loading = !data && !error
  // If API returned `401 Unauthorized`, assume the user is not logged in
  const loggedOut = error && error.status === 401

  // Automatically redirect to /login from anywhere the hook is called before logging in
  // Additionally, it can pass in the path to return to via `returnTo` query param, but
  // this is not supported by the API yet.
  useEffect(() => {
    if (loggedOut && router.pathname !== '/login') {
      // router.push(`/login?returnTo=${encodeURIComponent(router.asPath)}`)
      router.push('/login')
    }
  }, [router, loggedOut])

  return {
    loading,
    loggedOut,
    user: {
      loggedIn: !loggedOut
    },
    mutate,
  }
}

export function useWarnBeforeUnload (active, promptText) {
  const router = useRouter()
  useEffect(() => {
    const handleWindowClose = (e) => {
      if (!active) return
      e.preventDefault()
      return (e.returnValue = promptText)
    }

    // const handleRouterChange = (url, obj) => {
    //   if (!active) return
    //   if (window.confirm(promptText)) return
    //   // Since back button changes the URL, we reset it
    //   if (router.asPath !== window.location.pathname) {
    //     window.history.pushState(null, null, router.asPath)
    //   }
    //   const errMessage = 'routeChange aborted.'
    //   throw errMessage
    // }

    window.addEventListener('beforeunload', handleWindowClose)
    // router.events.on('routeChangeStart', handleRouterChange)

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      // router.events.off('routeChangeStart', handleRouterChange)
    }
  }, [active, promptText, router, router.events])
  return true
}
