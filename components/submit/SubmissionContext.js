import React, { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { apiEndpoints, fetcher, customErrorRetry } from '../lib/api'

export const SubmissionContext = React.createContext()

// TOOD: Handle when the API request fails
export const PageContextProvider = ({ countryCode, children }) => {
  const router = useRouter()
  const { cc } = router.query

  const [refreshInterval, setRefreshInterval] = useState(0)

  const { data, error, mutate } = useSWR(
    cc ? `${apiEndpoints.SUBMISSION_LIST}/${cc}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      errorRetryCount: 2,
      dedupingInterval: 6000,
      onErrorRetry: customErrorRetry,
      refreshInterval,
    },
  )

  const { testList, changes, submissionState, linkToPR } = useMemo(() => {
    if (data) {
      return {
        testList: data.test_list,
        changes: data.changes,
        submissionState: data.state,
        linkToPR: data.pr_url,
      }
    }
    return {
      testList: undefined,
      changes: {},
      submissionState: null,
      linkToPR: null,
    }
  }, [data])

  useEffect(() => {
    if (submissionState === 'PR_OPEN') {
      setRefreshInterval(10000)
    } else if (submissionState !== 'PR_OPEN') {
      setRefreshInterval(0)
    }
  }, [submissionState])

  return (
    <SubmissionContext.Provider
      value={{
        countryCode,
        submissionState,
        linkToPR,
        testList,
        changes,
        mutate,
        error,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  )
}
