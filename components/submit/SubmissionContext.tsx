import React from 'react'
import useSWR from 'swr'
import { customErrorRetry, eApiEndpoints, fetcher } from '../lib/api'
import { SubmissionContextType } from '../types'

export const SubmissionContext = React.createContext<SubmissionContextType>({} as SubmissionContextType)

type PageContextProviderProps = {
  children?: React.ReactNode
}

// TOOD: Handle when the API request fails
export const PageContextProvider = ({ children }: PageContextProviderProps) => {
  const { data, mutate } = useSWR(eApiEndpoints.SUBMISSION_STATE, fetcher, {
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
