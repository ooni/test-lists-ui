import { Flex } from 'ooni-components'

import UrlEntry from './UrlEntry'

const ResultList = ({ results }) => {
  return (
    <Flex mx={3} flexDirection='column'>
      {results.map(entry =>
        <UrlEntry {...entry} />
      )}
    </Flex>
  )
}

export default ResultList
