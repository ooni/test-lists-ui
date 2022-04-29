import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

import { fetcher, apiEndpoints } from './api'

export function useUser () {
  const { data, error, isValidating, mutate } = useSWR(apiEndpoints.ACCOUNT_METADATA, fetcher)
  const router = useRouter()

  // Automatically redirect to /login from anywhere the hook is called before logging in
  // (not yet) passing in the path to return to via `returnTo` query param
  useEffect(() => {
    if (typeof data === 'object' && !('nick' in data) && router.pathname !== '/login') {
      // router.push(`/login?returnTo=${encodeURIComponent(router.asPath)}`)
      router.push('/login')
    }
  }, [isValidating, data, router])

  const loading = !data && !error
  const loggedOut = error && error.status === 403

  return {
    loading,
    loggedOut,
    user: data?.nick ? data : null,
    mutate
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
