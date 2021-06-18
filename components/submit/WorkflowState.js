import React, { useCallback, useState } from 'react'
import { Flex, Button } from 'ooni-components'
import State from './State'
import Diff from './Diff'
import Error from './Error'
import { submitChanges } from '../lib/api'

const WorkflowState = () => {
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

  return (
    <Flex my={2} flexDirection='column' p={2}>
      <Diff />
      <Flex my={1} alignItems='center' justifyContent='flex-end'>
        <State />
        <Button ml={3} onClick={onSubmit}>Submit</Button>
      </Flex>
      {error && <Error> {error} </Error>}
    </Flex>
  )
}

export default WorkflowState
