import useSWR from 'swr'
import { Box } from 'ooni-components'

import { fetchTestList, apiEndpoints, updateRule } from '../lib/api'
import Error from './Error'
import Table from './Table'

const DataBox = ({ data }) => (
  <Box>
      <pre>{JSON.stringify(data, null, 2)}</pre>
  </Box>
)
const UrlList = ({ cc }) => {
  const { data, error, mutate } = useSWR(
    [apiEndpoints.SUBMISSION_LIST, cc],
    fetchTestList,
    // {
    //   initialData: initalData
    // }
  )

  return (
    <>
      {data && <Table data={data} mutate={mutate} />}
      {error && <Error>{error.message}</Error>}
    </>
  )
}

export default UrlList