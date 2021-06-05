import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Flex, Modal } from 'ooni-components'

import { fetchTestList, apiEndpoints, updateURL } from '../lib/api'
import Error from './Error'
import Table from './Table'
import { EditForm } from './EditForm'

// Does these
// * Decides what data to pass down to the table
// * Controls when the table is allowed to reset its state
//   e.g when editing is going on, no resetting sort order
const UrlList = ({ cc }) => {
  // holds rowIndex of row being edited
  const [editIndex, setEditIndex] = useState(-1)
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

  const handleSubmit = useCallback((newEntry, comment) => {
    const keys = ['url', 'category_code', 'category_description', 'date_added', 'source', 'notes']
    const oldEntryValues = keys.map(k => entryToEdit[k])

    updateURL(cc, comment, oldEntryValues, newEntry).then((updatedEntry) => {
      const updatedEntryObj = updatedEntry.reduce((o, v, i) => { o[keys[i]] = v; return o }, {})
      const updatedData = data.map((v, i) => editIndex === i ? updatedEntryObj : v)
      mutate(updatedData, true)
      setEditIndex(-1)
      setFormError(null)
    }).catch(e => {
      setFormError(`Update URL failed: ${e?.response?.data?.error ?? e}`)
    })
  }, [cc, entryToEdit, data, mutate, editIndex])

  const onCancel = () => {
    setEditIndex(-1)
    setFormError(null)
  }

  useEffect(() => {
    setSkipPageResest(false)
  }, [data])

  return (
    <Flex flexDirection='column' my={2}>
      {data && <Table data={data} onEdit={onEdit} skipPageReset={skipPageReset} />}
      {error && <Error>{error.message}</Error>}
      {data && editIndex > -1 && (
        <Modal show={editIndex > -1} onHideClick={onCancel}>
          <EditForm onSubmit={handleSubmit} onCancel={onCancel} oldEntry={entryToEdit} error={formError} />
        </Modal>
      )}
    </Flex>
  )
}

export default UrlList
