import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import useSWR, { mutate as globalMutate } from 'swr'
import { apiEndpoints, customErrorRetry, fetcher, fetchTestList } from '../lib/api'

export const SubmissionContext = React.createContext()

// TOOD: Handle when the API request fails
export const PageContextProvider = ({ countryCode, children }) => {
  const { query: { cc } } = useRouter()
  const [refreshInterval, setRefreshInterval] = useState(0)
  const { data, mutate } = useSWR(apiEndpoints.SUBMISSION_STATE, fetcher, {
    errorRetryCount: 2,
    onErrorRetry: customErrorRetry,
    refreshInterval,
  })

  const { state, pr_url } = data ?? { state: 'CLEAN', pr_url: undefined }

  const mutateChanges = useCallback(() => {
    globalMutate(
      apiEndpoints.SUBMISSION_CHANGES,
      fetcher(apiEndpoints.SUBMISSION_CHANGES).catch((e) => { console.log(e) })
    )
  }, [])

  const mutateUrlList = useCallback(() => {
    globalMutate(
      [apiEndpoints.SUBMISSION_LIST, cc],
      fetchTestList(apiEndpoints.SUBMISSION_LIST, cc).catch((e) => { console.log(e) })
    )
  }, [cc])

  useEffect(() => {
    if (state === 'PR_OPEN') {
      setRefreshInterval(10000)
    } else if (state !== 'PR_OPEN') {
      setRefreshInterval(0)
      mutateChanges()
      if (cc) {
        mutateUrlList()
      }
    }
  }, [state, cc, mutateChanges, mutateUrlList])

  return (
    <SubmissionContext.Provider
      value={{ countryCode, submissionState: state, linkToPR: pr_url, mutate }}
    >
      {children}
    </SubmissionContext.Provider>
  )
}
