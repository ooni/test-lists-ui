import { Box, Container, Flex, Heading, Link } from 'ooni-components'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import Loading from '../Loading'
import { addURL, deleteURL, updateURL } from '../lib/api'
import { useNotifier } from '../lib/notifier'
import { getPrettyErrorMessage } from '../lib/translateErrors'
import DeleteForm from './DeleteForm'
import { EditForm } from './EditForm'
import Error from './Error'
import ModalWithEsc from './ModalWithEsc'
import { SubmissionContext } from './SubmissionContext'
import Table from './Table'

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

  const {
    submissionState,
    testList,
    mutate: mutateSubmissionState,
    error,
  } = useContext(SubmissionContext)

  const entryToEdit = useMemo(() => {
    let entry = {}
    if (testList?.length) {
      if (editIndex !== null && editIndex > -1) {
        entry = testList[editIndex]
      }
      if (deleteIndex !== null) {
        entry = testList[deleteIndex]
      }
    }
    delete entry.category_description
    return entry
  }, [testList, editIndex, deleteIndex])

  const onEdit = useCallback((index) => {
    setSkipPageResest(true)
    setEditIndex(index)
    setEditFormError(null)
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
              // Revalidate the submission state to show the submit button
              mutateSubmissionState()
              resolve()
            })
            .catch((e) => {
              const prettyErrorMessage = getPrettyErrorMessage(
                e.message,
                'delete',
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
              // Revalidate the submission state to show the submit button
              mutateSubmissionState()
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
              // Revalidate the submission state to show the submit button
              mutateSubmissionState()
              resolve()
            })
            .catch((e) => {
              const prettyErrorMessage = getPrettyErrorMessage(
                e.message,
                'edit',
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
        },
      )
      return actionPromise
    },
    [notify, deleteIndex, editIndex, cc, entryToEdit, mutateSubmissionState],
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
  }, [testList])

  useEffect(() => {
    // NOTE: addFormError isn't reset even when the page navigates to another country list
    // This manually removes the error message under the "Add new URL" section when a new `{cc}` is selected
    setAddFormError(null)
  }, [cc])

  return (
    <Flex flexDirection='column' my={2}>
      {!!testList?.length && (
        <>
          <Box py={2}>
            <EditForm
              layout='row'
              onSubmit={handleSubmit}
              oldEntry={{}}
              error={addFormError}
            />
          </Box>

          <Table
            data={testList}
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
      {testList === null && (
        <Heading h={4} px={[1, 5]} py={4} my={4} bg='white' color='gray9'>
          We do not currently have a test list for this country and we do not
          support creating new ones here yet. If you would like to contribute to
          this country test list, send an email to{' '}
          <Link href='mailto:contact@openobservatory.org'>
            <em>contact@openobservatory.org</em>
          </Link>
        </Heading>
      )}
      {testList === undefined && <Loading size={200} />}
      {error && <Error>{error.message}</Error>}
    </Flex>
  )
}

export default UrlList
