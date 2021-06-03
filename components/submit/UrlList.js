import useSWR from 'swr'
import { Flex, Box } from 'ooni-components'

import { fetchTestList, apiEndpoints, updateRule } from '../lib/api'
import Error from './Error'
import Table from './Table'

const UrlList = ({ cc }) => {
  const { data, error, isValidating, mutate } = useSWR(
    [apiEndpoints.SUBMISSION_LIST, cc],
    fetchTestList,
  )

  return (
    <Flex flexDirection='column' my={2}>
      {data && <Table data={data} mutate={mutate} isValidating={isValidating} />}
      {error && <Error>{error.message}</Error>}
    </Flex>
  )
}

export default UrlList