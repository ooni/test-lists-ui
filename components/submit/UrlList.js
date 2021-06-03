import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Flex, Box } from 'ooni-components'

import { fetchTestList, apiEndpoints, updateRule } from '../lib/api'
import Error from './Error'
import Table from './Table'
import { EditModal } from './EditModal'
import mockData from "./mockData.json";

const UrlList = ({ cc }) => {
  const [editIndex, setEditIndex] = useState(-1)

  const { data, error, isValidating, mutate } = useSWR(
    [apiEndpoints.SUBMISSION_LIST, cc],
    fetchTestList,
    {
      initialData: mockData,
      // dedupingInterval: 60 * 60 * 1000
    }
  )

  const initialDataForEditor = useMemo(() => {
    if (data && editIndex > -1) {
      return {
        ...data[editIndex],
      }
    } else {
      return {}
    }
  }, [data, editIndex])

  const onEdit = useCallback((index) => {
    setEditIndex(index)
  }, [])

  const onEditComplete = () => setEditIndex(-1)

  const onCancel = () => {
    setEditIndex(-1)
  }

  return (
    <Flex flexDirection='column' my={2}>
      {data && <Table data={data} mutate={mutate} isValidating={isValidating} onEdit={onEdit} />}
      {error && <Error>{error.message}</Error>}
      {data && editIndex > -1 && (
        <EditModal
          open={editIndex > -1}
          onSuccess={onEditComplete}
          onHideClick={onCancel} closeButton='right'
          data={initialDataForEditor}
          cc={cc}
        />)
      }
    </Flex>
  )
}

export default UrlList


