import useSWR from 'swr'

import { fetchTestList, apiEndpoints, updateRule } from '../lib/api'
import Error from './Error'

const UrlList = ({ cc }) => {
  const { data, error } = useSWR(
    [apiEndpoints.SUBMISSION_LIST, cc],
    fetchTestList,
  )

  return (
    <>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <Error>{error.message}</Error>}
    </>
  )
}

export default UrlList