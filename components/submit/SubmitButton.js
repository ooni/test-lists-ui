import React, { useCallback, useContext } from 'react'
import { Box, Button, Link, Flex } from 'ooni-components'
import styled from 'styled-components'

import { submitChanges } from '../lib/api'
import { SubmissionContext } from './SubmissionContext'
import { useNotifier } from '../lib/notifier'
import Changes from './Changes'

const StickyFlex = styled(Flex)`
  position: sticky;
  top: 0px;
  z-index: 1;
`

const SubmitButton = () => {
  const { notify } = useNotifier()
  const { submissionState, linkToPR, mutate } = useContext(SubmissionContext)
  const isSubmitted = submissionState === 'PR_OPEN'
  const isEditing = submissionState === 'IN_PROGRESS'
  const isClean = submissionState === 'CLEAN'

  const onSubmit = useCallback(() => {
    const loadingNotification = notify.loading('Submitting...')
    submitChanges()
      .then((pr_id) => {
        mutate({ state: 'PR_OPEN', pr_url: pr_id }, true)
        notify.dismiss(loadingNotification)
        notify.success('Submitted!')
      })
      .catch((e) => {
        notify.dismiss(loadingNotification)
        notify.error(`Submission failed. Reason: ${e.message}`)
        console.error('Submission failed')
        console.error(e)
      })
  }, [mutate, notify])

  return (
    <>
      <Changes />
      <StickyFlex
        flexDirection={['column']}
        px={4}
        py={3}
        mb={4}
        bg='gray4'
        // color='white'
      >
        <Flex>
          <Button
            onClick={onSubmit}
            title={`Current state: ${submissionState}`}
            disabled={isSubmitted || isClean}
          >
            Submit
          </Button>
        </Flex>

        <Flex my={[2, 2]}>
          {isClean && (
            <Box>
              Add, Edit or Delete URLs in the list. Then submit your changes for
              review.
            </Box>
          )}
          {isSubmitted && (
            <Box>
              Your submission is being reviewed{' '}
              <Link href={linkToPR}>here.</Link>
            </Box>
          )}
          {isEditing && (
            <Box>
              When you are done making changes, click <strong>Submit</strong> to
              propose your changes.
            </Box>
          )}
        </Flex>
      </StickyFlex>
    </>
  )
}

export default SubmitButton
