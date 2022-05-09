import React, { useCallback, useContext } from 'react'
import { Box, Button, Heading, Link, Flex } from 'ooni-components'
import styled from 'styled-components'
import Lottie from 'react-lottie-player'

import { submitChanges } from '../lib/api'
import reviewAnimation from './review-animation.json'
import { SubmissionContext } from './SubmissionContext'
import { useNotifier } from '../lib/notifier'

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
  const { notify } = useNotifier()
  const { submissionState, linkToPR, mutate } = useContext(SubmissionContext)

  const onSubmit = useCallback(() => {
    const loadingNotification = notify.loading('Submitting...')
    submitChanges().then((pr_id) => {
      mutate({ state: 'PR_OPEN', pr_url: pr_id }, true)
      notify.dismiss(loadingNotification)
      notify.success('Submitted!')
    }).catch(e => {
      notify.dismiss(loadingNotification)
      notify.error(`Submission failed. Reason: ${e.message}`)
      console.error('Submission failed')
      console.error(e)
    })
  }, [mutate, notify])

  if (submissionState === 'IN_PROGRESS') {
    return (
      <FloatingBox>
        <Button
          fontSize={2}
          ml='auto'
          onClick={onSubmit}
          title={`Current state: ${submissionState}`}
        >
          Submit
        </Button>
      </FloatingBox>
    )
  } else if (submissionState === 'PR_OPEN') {
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
            changes are being reviewed <Link href={linkToPR}>here.</Link> You
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
