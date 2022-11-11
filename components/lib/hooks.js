import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

import { userFetcher, apiEndpoints, customErrorRetry } from './api'

export function useUser () {
  const { data, error, mutate } = useSWR(apiEndpoints.ACCOUNT_METADATA, userFetcher, {
    dedupingInterval: 1800000,
    onErrorRetry: customErrorRetry
  })
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
