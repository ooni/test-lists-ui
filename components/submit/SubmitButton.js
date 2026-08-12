import { useCallback, useContext } from 'react'

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
    <div className="mb-8 flex flex-col py-4">
      <div className="my-2">
        {isClean && (
          <p>{formatMessage({ id: 'SubmitButton.CleanState' })}</p>
        )}
        {isSubmitted && (
          <p>
            {formatMessage(
              { id: 'SubmitButton.SubmittedState' },
              { link: (string) => <a href={linkToPR}>{string}</a> },
            )}
          </p>
        )}
        {isEditing && (
          <p>
            {formatMessage(
              { id: 'SubmitButton.EditingState' },
              { strong: (string) => <strong>{string}</strong> },
            )}
          </p>
        )}
      </div>
      <div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={onSubmit}
          title={`Current state: ${submissionState}`}
          disabled={isSubmitted || isClean}
        >
          {formatMessage({ id: 'SubmitButton.Submit' })}
        </button>
      </div>
    </div>
  )
}

export default SubmitButton
