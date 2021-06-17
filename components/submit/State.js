import React from 'react'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '../lib/api'
import { Box } from 'ooni-components'

const State = () => {
  const { data, error } = useSWR(apiEndpoints.SUBMISSION_STATE, fetcher)
  return (
    <Box>Current State: {data ? data.state : (error ? error.toString() : 'Loading...')}</Box>
  )
}

export default State
