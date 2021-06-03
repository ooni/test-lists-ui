import { useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'

import { fetcher, apiEndpoints } from './api'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

export function useUser() {
  const router = useRouter()
  const { data, error, mutate, isValidating } = useSWR(apiEndpoints.ACCOUNT_METADATA, fetcher, swrOptions)

  // Automatically redirect to /login from anywhere the hook is called before logging in
  // passing in the path to return to via `returnTo` query param
  useEffect(() => {
    if (!isValidating && !data?.nick && router.pathname !== '/login') {
      console.log(encodeURIComponent(router.asPath))
      router.push(`/login?returnTo=${encodeURIComponent(router.asPath)}`)
    }
  }, [isValidating, data])


  const loading = !data && !error
  const loggedOut = error && error.status === 403

  return {
    loading,
    loggedOut,
    user: data?.nick ? data : null,
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