import { Box, Button, Flex, Link } from 'ooni-components'
import React, { useCallback, useContext } from 'react'

import { useIntl } from 'react-intl'
import { submitChanges } from '../lib/api'
import { useNotifier } from '../lib/notifier'
import { SubmissionContext } from './SubmissionContext'

const SubmitButton = () => {
  const { formatMessage } = useIntl()
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
    <Flex flexDirection={['column']} py={3} mb={4}>
      <Flex my={[2, 2]}>
        {isClean && (
          <Box>{formatMessage({ id: 'SubmitButton.CleanState' })}</Box>
        )}
        {isSubmitted && (
          <Box>
            {formatMessage(
              { id: 'SubmitButton.SubmittedState' },
              { link: (string) => <Link href={linkToPR}>{string}</Link> },
            )}
          </Box>
        )}
        {isEditing && (
          <Box>
            {formatMessage(
              { id: 'SubmitButton.EditingState' },
              { strong: (string) => <strong>{string}</strong> },
            )}
          </Box>
        )}
      </Flex>
      <Flex>
        <Button
          onClick={onSubmit}
          title={`Current state: ${submissionState}`}
          disabled={isSubmitted || isClean}
        >
          {formatMessage({ id: 'SubmitButton.Submit' })}
        </Button>
      </Flex>
    </Flex>
  )
}

export default SubmitButton
