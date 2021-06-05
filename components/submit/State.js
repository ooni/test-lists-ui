import React from 'react'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '../lib/api'
import { Box } from 'ooni-components'

const State = () => {
  const { data } = useSWR(apiEndpoints.SUBMISSION_STATE, fetcher)
  return (
    <Box>State: {data ? data.state : 'Loading...'}</Box>
  )
}

export default State
