import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR, { mutate as globalMutate } from 'swr'
import { Box, Flex, Heading, Link } from 'ooni-components'

import { fetcher, fetchTestList, apiEndpoints, updateURL, addURL, deleteURL, customErrorRetry } from '../lib/api'
import Error from './Error'
import Table from './Table'
import { EditForm } from './EditForm'
import ModalWithEsc from './ModalWithEsc'
import DeleteForm from './DeleteForm'
import Loading from '../Loading'
import SubmitButton from './SubmitButton'
import { getPrettyErrorMessage } from '../lib/translateErrors'

// Does these
// * Decides what data to pass down to the table
// * Controls when the table is allowed to reset its state
//   e.g when editing is going on, no resetting sort order
const UrlList = ({ cc }) => {
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
      revalidateOnFocus: false,
      dedupingInterval: 6000,
      errorRetryInterval: 1000,
      errorRetryCount: 2,
      onErrorRetry: customErrorRetry
    }
  )

  const { data: { state: submissionState } } = useSWR(
    apiEndpoints.SUBMISSION_STATE,
    fetcher,
    { initialData: { state: null } }
  )

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

  const handleSubmit = useCallback((newEntry, comment) => {
    return new Promise((resolve, reject) => {
      if (deleteIndex !== null) {
        // Delete
        deleteURL(cc, comment, entryToEdit).then(() => {
          setDeleteIndex(null)
          setEditFormError(null)
          const updatedData = data.filter(i => i.url !== entryToEdit.url)
          mutate(updatedData, true)

          // Revalidate the submission state to show the submit button
          globalMutate(apiEndpoints.SUBMISSION_STATE)

          resolve()
        }).catch(e => {
          setEditFormError(`deleteURL failed: ${e?.response?.data?.error ?? e}`)
          reject(e?.response?.data?.error ?? e)
        })
      } else if (editIndex === null) {
        // Add
        addURL(newEntry, cc, comment).then(() => {
          setEditIndex(null)
          setAddFormError(null)
          const updatedData = [...data, newEntry]
          mutate(updatedData, true)

          // Revalidate the submission state to show the submit button
          globalMutate(apiEndpoints.SUBMISSION_STATE)

          resolve()
        }).catch(e => {
          const prettyErrorMessage = getPrettyErrorMessage(e?.response?.data?.error ?? e, 'add')
          setAddFormError(prettyErrorMessage)
          reject(e?.response?.data?.error ?? e)
        })
      } else {
        // Update
        updateURL(cc, comment, entryToEdit, newEntry).then((updatedEntry) => {
          setEditIndex(null)
          setEditFormError(null)
          const updatedData = data.map((v, i) => editIndex === i ? updatedEntry : v)
          mutate(updatedData, true)
          // Revalidate the submission state to show the submit button
          globalMutate(apiEndpoints.SUBMISSION_STATE)

          resolve()
        }).catch(e => {
          const prettyErrorMessage = getPrettyErrorMessage(e?.response?.data?.error ?? e, 'add')
          setEditFormError(prettyErrorMessage)
          reject(e?.response?.data?.error ?? e)
        })
      }
    })
  }, [editIndex, deleteIndex, entryToEdit, cc, data, mutate])

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
          <Box p={2}>
            {submissionState !== 'PR_OPEN' &&
              <EditForm layout='row' onSubmit={handleSubmit} oldEntry={{}} error={addFormError} />
            }
          </Box>

          <SubmitButton />

          <Table data={data} onEdit={onEdit} onDelete={onDelete} skipPageReset={skipPageReset} submissionState={submissionState} />

          {editIndex !== null && (
            <ModalWithEsc onCancel={onCancel} show={editIndex !== null} onHideClick={onCancel}>
              <EditForm layout='column' onSubmit={handleSubmit} onCancel={onCancel} oldEntry={entryToEdit} error={editFormError} />
            </ModalWithEsc>
          )}

          {deleteIndex !== null && (
            <ModalWithEsc onCancel={onCancelDelete} show={deleteIndex !== null} onHideClick={onCancelDelete}>
              <DeleteForm oldEntry={entryToEdit} onDelete={handleSubmit} onCancel={onCancelDelete} error={editFormError} />
            </ModalWithEsc>
          )}
        </>
      )}
      {!data && error && error.message === 'Country not supported' &&
        <Heading h={4} px={[1, 5]} py={4} my={4} bg='white' color='gray9'>
          We do not currently have a test list for this country and we do not support creating new ones here yet.
          If you would like to contribute to this country test list, send an email
          to <Link href='mailto:contact@openobservatoyr.org'><em>contact@openobservatory.org</em></Link>
        </Heading>
      }
      {!data && !error && <Loading size={200} />}
      {error && <Error>{error.message}</Error>}
    </Flex>
  )
}

export default UrlList
