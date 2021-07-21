import React, { useCallback, useState } from 'react'
import { Box, Button, Heading, Link, Flex } from 'ooni-components'
import styled from 'styled-components'
import useSWR, { mutate } from 'swr'
import Lottie from 'react-lottie-player'

import { apiEndpoints, customErrorRetry, fetcher, submitChanges } from '../lib/api'
import reviewAnimation from './review-animation.json'

const FloatingBox = styled(Box)`
  position: fixed;
  margin-left: auto;
  bottom: 30px;
  right: 100px;
`

const AttributionBox = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.5;
`

const SubmitButton = () => {
  const [error, setError] = useState(null)

  const { data } = useSWR(apiEndpoints.SUBMISSION_STATE, fetcher, {
    errorRetryCount: 2,
    onErrorRetry: customErrorRetry
  })

  const onSubmit = useCallback(() => {
    submitChanges().then(() => {
      mutate(apiEndpoints.SUBMISSION_STATE, true)
      console.log('Submission done!')
      setError(null)
    }).catch(e => {
      console.error('Submission failed')
      console.error(e)
      setError(`Submission failed: ${e?.response?.data?.error ?? e}`)
    })
  }, [])

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
  } else if (data && data.state === 'PR_OPEN') {
    return (
      <Flex flexDirection={['column', 'row']} alignItems='center' color='gray9' bg='white' px={2} py={4} my={4} sx={{ position: 'relative' }}>
        <Box width={[1, 1 / 5]} px={[5, 0]}>
          <Lottie
            loop
            animationData={reviewAnimation}
            play
          />
        </Box>
        <Box width={[1, 4 / 5]}>
          <Heading h={3}>Submitted!</Heading>
          <Heading h={4}>
            Thank you for contributing to improve to the test lists. Your
            changes are being reviewed <Link href={data.pr_url}>here.</Link> You
            will be able to make further changes after this contribution has been processed by our team.
          </Heading>
        </Box>
        <AttributionBox>
          <Link href='https://lottiefiles.com/68761-preview-animation'>Animation by Kyunghwan Lee</Link>
        </AttributionBox>
      </Flex>
    )
  } else {
    return null
  }
}

export default SubmitButton
