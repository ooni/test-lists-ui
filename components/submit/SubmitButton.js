import React, { useCallback, useState } from 'react'
import { Box, Button } from 'ooni-components'
import styled from 'styled-components'
import useSWR from 'swr'

import { apiEndpoints, customErrorRetry, fetcher, submitChanges } from '../lib/api'

const FloatingBox = styled(Box)`
  position: sticky;
  margin-left: auto;
  top: 10px;
`

const SubmitButton = () => {
  const [error, setError] = useState(null)

  const onSubmit = useCallback(() => {
    submitChanges().then(() => {
      console.log('Submission done!')
      setError(null)
    }).catch(e => {
      console.error('Submission failed')
      console.error(e)
      setError(`Submission failed: ${e?.response?.data?.error ?? e}`)
    })
  }, [])

  const { data } = useSWR(apiEndpoints.SUBMISSION_STATE, fetcher, {
    errorRetryCount: 2,
    onErrorRetry: customErrorRetry
  })

  if (data && data.state === 'IN_PROGRESS') {
    return (
      <FloatingBox>
        <Button
          fontSize={2}
          ml='auto'
          onClick={onSubmit}
          title={error || `Current state: ${data.state}`}
        >
          Submit
        </Button>
      </FloatingBox>
    )
  } else {
    return null
  }
}

export default SubmitButton
