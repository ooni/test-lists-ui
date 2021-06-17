import React from 'react'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '../lib/api'
import { Flex, Box, Heading } from 'ooni-components'

const Diff = () => {
  const { data, error } = useSWR(apiEndpoints.SUBMISSION_DIFF, fetcher, {
    errorRetryCount: 0
  })
  return (
    <Flex flexDirection='column'>
      <Heading h={4}>Changes to be submitted</Heading>
      <Box as='code'>{data ? data.state : (error ? error.toString() : 'Loading...')}</Box>
    </Flex>
  )
}

export default Diff
