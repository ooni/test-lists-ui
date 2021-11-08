import React from 'react'
import useSWR from 'swr'
import { apiEndpoints, customErrorRetry, fetcher } from '../lib/api'

export const SubmissionContext = React.createContext()

// TOOD: Handle when the API request fails
export const PageContextProvider = ({ children }) => {
  const { data, mutate } = useSWR(apiEndpoints.SUBMISSION_STATE, fetcher, {
    errorRetryCount: 2,
    onErrorRetry: customErrorRetry
  })

  const { state, pr_url } = data ?? { state: 'CLEAN', pr_url: undefined }

  return (
    <SubmissionContext.Provider value={{ submissionState: state, linkToPR: pr_url, mutate }}>
      {children}
    </SubmissionContext.Provider>
  )
}
