import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Box, Flex, Container } from 'ooni-components'

import { fetcher, fetchTestList, apiEndpoints, updateURL, addURL, deleteURL } from '../lib/api'
import Error from './Error'
import Table from './Table'
import { EditForm } from './EditForm'
import ModalWithEsc from './ModalWithEsc'
import DeleteForm from './DeleteForm'

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
      // initialData: mockData,
      // dedupingInterval: 60 * 60 * 1000
    }
  )

  const { data: { state: submissionState } } = useSWR(apiEndpoints.SUBMISSION_STATE, fetcher)

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
    if (deleteIndex !== null) {
      // Delete
      deleteURL(cc, comment, entryToEdit).then(() => {
        setDeleteIndex(null)
        setEditFormError(null)
      }).catch(e => {
        setEditFormError(`deleteURL failed: ${e?.response?.data?.error ?? e}`)
      })
    } else if (editIndex === -1) {
      // Add
      addURL(newEntry, cc, comment).then(() => {
        setEditIndex(null)
        setAddFormError(null)
      }).catch(e => {
        setAddFormError(`addURL failed: ${e?.response?.data?.error ?? e}`)
      })
    } else {
      // Update
      updateURL(cc, comment, entryToEdit, newEntry).then((updatedEntry) => {
        const updatedData = data.map((v, i) => editIndex === i ? updatedEntry : v)
        mutate(updatedData, true)
        setEditIndex(null)
        setEditFormError(null)
      }).catch(e => {
        setEditFormError(`Update URL failed: ${e?.response?.data?.error ?? e}`)
      })
    }
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

  return (
    <Flex flexDirection='column' my={2}>
      <Box p={2}>
        {submissionState !== 'PR_OPEN' &&
          <EditForm layout='row' onSubmit={handleSubmit} oldEntry={{}} error={addFormError} />
        }
      </Box>
      {data && <Table data={data} onEdit={onEdit} onDelete={onDelete} skipPageReset={skipPageReset} submissionState={submissionState} />}
      {error && <Error>{error.message}</Error>}
      {data && editIndex !== null && (
        <ModalWithEsc onCancel={onCancel} show={editIndex !== null} onHideClick={onCancel}>
          <Container sx={{ width: ['90vw', '40vw'] }} px={[2, 5]} py={[2, 3]} color='gray8'>
            <EditForm layout='column' onSubmit={handleSubmit} onCancel={onCancel} oldEntry={entryToEdit} error={editFormError} />
          </Container>
        </ModalWithEsc>
      )}
      {data && deleteIndex !== null && (
        <ModalWithEsc onCancel={onCancelDelete} show={deleteIndex !== null} onHideClick={onCancelDelete}>
          <Container sx={{ width: ['90vw', '40vw'] }} px={[2, 5]} py={[2, 3]} color='gray8'>
            <DeleteForm oldEntry={entryToEdit} onDelete={handleSubmit} onCancel={onCancelDelete} error={editFormError} />
          </Container>
        </ModalWithEsc>
      )}
    </Flex>
  )
}

export default UrlList
