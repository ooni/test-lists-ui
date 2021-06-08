import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Box, Button, Flex, Modal, Container } from 'ooni-components'

import { fetchTestList, apiEndpoints, updateURL, addURL } from '../lib/api'
import Error from './Error'
import Table from './Table'
import { EditForm } from './EditForm'
import ModalWithEsc from './ModalWithEsc'

// Does these
// * Decides what data to pass down to the table
// * Controls when the table is allowed to reset its state
//   e.g when editing is going on, no resetting sort order
const UrlList = ({ cc }) => {
  // holds rowIndex of row being edited
  const [editIndex, setEditIndex] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  // controls when table state can be reset
  const [skipPageReset, setSkipPageResest] = useState(false)
  // error to show when the edit form modal is on
  const [formError, setFormError] = useState(null)

  const { data, error, mutate } = useSWR(
    [apiEndpoints.SUBMISSION_LIST, cc],
    fetchTestList,
    {
      // initialData: mockData,
      // dedupingInterval: 60 * 60 * 1000
    }
  )

  const entryToEdit = useMemo(() => {
    if (data && editIndex > -1) {
      return {
        ...data[editIndex]
      }
    } else {
      return {}
    }
  }, [data, editIndex])

  const onEdit = useCallback((index) => {
    setSkipPageResest(true)
    setEditIndex(index)
    setFormError(null)
  }, [])

  const onAdd = useCallback(() => {
    setEditIndex(-1)
    setFormError(null)
  }, [])

  const toggleShowAddForm = useCallback(() => {
    setShowAddForm(state => !state)
  }, [])

  const handleSubmit = useCallback((newEntry, comment) => {
    const keys = ['url', 'category_code', 'category_description', 'date_added', 'source', 'notes']
    const oldEntryValues = editIndex > -1 ? keys.map(k => entryToEdit[k]) : []

    if (editIndex === -1) {
      // Add
      addURL(newEntry, cc, comment).then(() => {
        setEditIndex(null)
        setShowAddForm(false)
        setFormError(null)
      }).catch(e => {
        setFormError(`AddURL failed: ${e?.response?.data?.error ?? e}`)
      })
    } else {
      // Update
      updateURL(cc, comment, oldEntryValues, newEntry).then((updatedEntry) => {
        const updatedEntryObj = updatedEntry.reduce((o, v, i) => { o[keys[i]] = v; return o }, {})
        const updatedData = data.map((v, i) => editIndex === i ? updatedEntryObj : v)
        mutate(updatedData, true)
        setEditIndex(null)
        setFormError(null)
      }).catch(e => {
        setFormError(`Update URL failed: ${e?.response?.data?.error ?? e}`)
      })
    }
  }, [cc, entryToEdit, data, mutate, editIndex])

  const onCancel = () => {
    setEditIndex(null)
    setFormError(null)
  }

  useEffect(() => {
    setSkipPageResest(false)
  }, [data])

  return (
    <Flex flexDirection='column' my={2}>
      <Flex my={1}>
        <Box ml='auto'><Button onClick={onAdd}> Add Modal </Button></Box>
        <Box mx={3}><Button onClick={toggleShowAddForm}> {showAddForm ? 'Hide' : 'Show'} Add Form</Button></Box>
      </Flex>
      {showAddForm && (
        <Box bg='gray0' p={2}>
          <EditForm layout='row' onSubmit={handleSubmit} onCancel={() => setShowAddForm(false)} oldEntry={{}} error={formError} />
        </Box>
      )}
      {data && <Table data={data} onEdit={onEdit} skipPageReset={skipPageReset} />}
      {error && <Error>{error.message}</Error>}
      {data && editIndex !== null && (
        <ModalWithEsc onCancel={onCancel} show={editIndex !== null} onHideClick={onCancel}>
          <Container sx={{ width: ['90vw', '40vw'] }} px={[2, 5]} color='gray8'>
            <EditForm layout='column' onSubmit={handleSubmit} onCancel={onCancel} oldEntry={entryToEdit} error={formError} />
          </Container>
        </ModalWithEsc>
      )}
    </Flex>
  )
}

export default UrlList
