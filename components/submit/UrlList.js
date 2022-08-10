import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import useSWR, { mutate as globalMutate } from 'swr'
import { Box, Flex, Container, Heading, Link } from 'ooni-components'

import { fetchTestList, apiEndpoints, updateURL, addURL, deleteURL, customErrorRetry, fetcher } from '../lib/api'
import Error from './Error'
import Table from './Table'
import { EditForm } from './EditForm'
import ModalWithEsc from './ModalWithEsc'
import DeleteForm from './DeleteForm'
import Loading from '../Loading'
import { getPrettyErrorMessage } from '../lib/translateErrors'
import { SubmissionContext } from './SubmissionContext'
import { useNotifier } from '../lib/notifier'

// Does these
// * Decides what data to pass down to the table
// * Controls when the table is allowed to reset its state
//   e.g when editing is going on, no resetting sort order
const UrlList = ({ cc }) => {
  const { notify } = useNotifier()
  // holds rowIndex of row being edited
  const [editIndex, setEditIndex] = useState(null)
  const [deleteIndex, setDeleteIndex] = useState(null)
  // controls when table state can be reset
  const [skipPageReset, setSkipPageResest] = useState(false)
  // error to show when the edit form modal is on
  const [editFormError, setEditFormError] = useState(null)
  // error to show when add action fails
  const [addFormError, setAddFormError] = useState(null)

  const { data, error, mutate } = useSWR(
    [apiEndpoints.SUBMISSION_LIST, cc],
    fetchTestList,
    {
      dedupingInterval: 6000,
      errorRetryInterval: 1000,
      errorRetryCount: 2,
      onErrorRetry: customErrorRetry,
    }
  )

  const { submissionState, mutate: mutateSubmissionState } =
    useContext(SubmissionContext)

  const entryToEdit = useMemo(() => {
    let entry = {}
    if (data) {
      if (editIndex !== null && editIndex > -1) {
        entry = data[editIndex]
      }
      if (deleteIndex !== null) {
        entry = data[deleteIndex]
      }
    }
    delete entry.category_description
    return entry
  }, [data, editIndex, deleteIndex])

  const onEdit = useCallback((index) => {
    setSkipPageResest(true)
    setEditIndex(index)
    setEditFormError(null)
  }, [])

  const mutateChanges = useCallback(async () => {
    globalMutate(
      apiEndpoints.SUBMISSION_CHANGES,
      await fetcher(apiEndpoints.SUBMISSION_CHANGES),
      false
    )
  }, [])

  const handleSubmit = useCallback(
    (newEntry, comment) => {
      const actionPromise = new Promise((resolve, reject) => {
        if (deleteIndex !== null) {
          // Delete
          deleteURL(cc, comment, entryToEdit)
            .then(() => {
              setDeleteIndex(null)
              setEditFormError(null)
              const updatedData = data.filter((i) => i.url !== entryToEdit.url)
              mutate(updatedData, true)

              // Revalidate the submission state to show the submit button
              mutateSubmissionState()
              // Update the changes section
              mutateChanges()

              resolve()
            })
            .catch((e) => {
              const prettyErrorMessage = getPrettyErrorMessage(
                e.message,
                'delete'
              )
              setEditFormError(prettyErrorMessage)
              reject(prettyErrorMessage)
            })
        } else if (editIndex === null) {
          // Add
          addURL(newEntry, cc, comment)
            .then((newEntry) => {
              setEditIndex(null)
              setAddFormError(null)
              const updatedData = [...data, newEntry]
              mutate(updatedData, true)

              // Revalidate the submission state to show the submit button
              mutateSubmissionState()
              // Update the changes section
              mutateChanges()

              resolve()
            })
            .catch((e) => {
              const prettyErrorMessage = getPrettyErrorMessage(e.message, 'add')
              setAddFormError(prettyErrorMessage)
              reject(prettyErrorMessage)
            })
        } else {
          // Update
          updateURL(cc, comment, entryToEdit, newEntry)
            .then((updatedEntry) => {
              setEditIndex(null)
              setEditFormError(null)
              const updatedData = data.map((v, i) =>
                editIndex === i ? updatedEntry : v
              )
              mutate(updatedData, true)
              // Revalidate the submission state to show the submit button
              mutateSubmissionState()
              // Update the changes section
              mutateChanges()

              resolve()
            })
            .catch((e) => {
              const prettyErrorMessage = getPrettyErrorMessage(
                e.message,
                'edit'
              )
              setEditFormError(prettyErrorMessage)
              reject(prettyErrorMessage)
            })
        }
      })
      notify.promise(
        actionPromise,
        {
          loading: 'Saving changes...',
          success:
            deleteIndex !== null
              ? 'Deleted'
              : editIndex === null
                ? 'Added'
                : 'Updated',
          error: (err) => `Failed: ${err}`,
        },
        {
          style: {
            maxWidth: '600px',
          },
        }
      )
      return actionPromise
    },
    [
      notify,
      deleteIndex,
      editIndex,
      cc,
      entryToEdit,
      data,
      mutate,
      mutateSubmissionState,
      mutateChanges,
    ]
  )

  const onCancel = () => {
    setEditIndex(null)
    setEditFormError(null)
  }

  const onDelete = useCallback((index) => {
    setDeleteIndex(index)
  }, [])

  const onCancelDelete = () => {
    setDeleteIndex(null)
    setEditFormError(null)
  }

  useEffect(() => {
    setSkipPageResest(false)
  }, [data])

  useEffect(() => {
    // NOTE: addFormError isn't reset even when the page navigates to another country list
    // This manually removes the error message under the "Add new URL" section when a new `{cc}` is selected
    setAddFormError(null)
  }, [cc])

  return (
    <Flex flexDirection='column' my={2}>
      {data && !error && (
        <>
          <Box py={2} mb={3}>
              <EditForm
                layout='row'
                onSubmit={handleSubmit}
                oldEntry={{}}
                error={addFormError}
              />
          </Box>
          <Heading h={4} mb={2}>Test List</Heading>
          <Table
            data={data}
            onEdit={onEdit}
            onDelete={onDelete}
            skipPageReset={skipPageReset}
            submissionState={submissionState}
          />

          {editIndex !== null && (
            <ModalWithEsc
              onCancel={onCancel}
              show={editIndex !== null}
              onHideClick={onCancel}
            >
              <Container
                sx={{ width: ['90vw', '40vw'] }}
                px={[2, 5]}
                py={[2, 3]}
                color='gray8'
              >
                <EditForm
                  layout='column'
                  onSubmit={handleSubmit}
                  onCancel={onCancel}
                  oldEntry={entryToEdit}
                  error={editFormError}
                />
              </Container>
            </ModalWithEsc>
          )}

          {deleteIndex !== null && (
            <ModalWithEsc
              onCancel={onCancelDelete}
              show={deleteIndex !== null}
              onHideClick={onCancelDelete}
            >
              <Container
                sx={{ width: ['90vw', '40vw'] }}
                px={[2, 5]}
                py={[2, 3]}
                color='gray8'
              >
                <DeleteForm
                  oldEntry={entryToEdit}
                  onDelete={handleSubmit}
                  onCancel={onCancelDelete}
                  error={editFormError}
                />
              </Container>
            </ModalWithEsc>
          )}
        </>
      )}
      {!data && error && error.message === 'Country not supported' && (
        <Heading h={4} px={[1, 5]} py={4} my={4} bg='white' color='gray9'>
          We do not currently have a test list for this country and we do not
          support creating new ones here yet. If you would like to contribute to
          this country test list, send an email to{' '}
          <Link href='mailto:contact@openobservatoyr.org'>
            <em>contact@openobservatory.org</em>
          </Link>
        </Heading>
      )}
      {!data && !error && <Loading size={200} />}
      {error && <Error>{error.message}</Error>}
    </Flex>
  )
}

export default UrlList
