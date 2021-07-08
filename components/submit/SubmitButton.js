import React, { useCallback, useState } from 'react'
import { Button } from 'ooni-components'
import styled from 'styled-components'
import useSWR from 'swr'
import { MdSend } from 'react-icons/md'

import { apiEndpoints, fetcher, submitChanges } from '../lib/api'

const FloatingButton = styled(Button)`
  position: fixed;
  bottom: 32px;
  right: 32px;
  box-shadow: 2px 2px 2px black;
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
      setError(`submitting changes failed: ${e?.response?.data?.error ?? e}`)
    })
  }, [])

  const { data } = useSWR(apiEndpoints.SUBMISSION_STATE, fetcher)

  if (data && data.state === 'IN_PROGRESS') {
    return (
      <FloatingButton fontSize={2} ml={3} onClick={onSubmit} title={`Current state: ${data.state}`}>Submit</FloatingButton>
    )
  } else {
    return null
  }
}

export default SubmitButton
