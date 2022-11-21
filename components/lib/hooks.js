import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { fetcher, apiEndpoints, customErrorRetry, refreshToken } from './api'

const TWELVE_HOURS = 1000 * 60 * 60 * 12
const TEN_MINUTES = 1000 * 60 * 10

export function useUser (props = {}) {
  const [tokenRefreshErrored, setTokenRefreshErrored] = useState(false)
  const { data, error, mutate } = useSWR(apiEndpoints.ACCOUNT_METADATA, fetcher, {
    dedupingInterval: 1000,
    onErrorRetry: customErrorRetry
  })
  const router = useRouter()

  useEffect(() => {
    if (!props.periodicTokenRefresh) return
    const interval = setInterval(() => {
      const tokenCreatedAt = JSON.parse(localStorage.getItem('bearer'))?.created_at
      if (tokenCreatedAt) {
        const tokenExpiry = tokenCreatedAt + TWELVE_HOURS
        const now = Date.now()
        if (now > tokenExpiry) {
          refreshToken().catch((e) => {
            if (e?.response?.status === 401) {
              localStorage.removeItem('bearer')
              setTokenRefreshErrored(true)
            }
          })
        }
      }
    }, TEN_MINUTES)

    return () => clearInterval(interval)
  }, [])

  const loading = !data && !error
  // If API returned `401 Unauthorized`, assume the user is not logged in
  const loggedOut = (error && error.status === 401) || tokenRefreshErrored

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

// export function useUser({ redirectTo, redirectIfFound } = {}) {
//   const { data, error } = useSWR('/api/user', fetcher)
//   const user = data?.user
//   const finished = Boolean(data)
//   const hasUser = Boolean(user)

//   useEffect(() => {
//     if (!redirectTo || !finished) return
//     if (
//       // If redirectTo is set, redirect if the user was not found.
//       (redirectTo && !redirectIfFound && !hasUser) ||
//       // If redirectIfFound is also set, redirect if the user was found
//       (redirectIfFound && hasUser)
//     ) {
//       Router.push(redirectTo)
//     }
//   }, [redirectTo, redirectIfFound, finished, hasUser])

//   return error ? null : user
// }
