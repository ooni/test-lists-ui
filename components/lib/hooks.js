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
