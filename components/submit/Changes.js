import { useContext } from 'react'
import useSWR from 'swr'
import { Box, Flex, Text, Heading } from 'ooni-components'
import { MdDelete, MdEdit } from 'react-icons/md'

import { apiEndpoints, fetcher } from '../lib/api'
import { SubmissionContext } from './SubmissionContext'

const ChangeSet = ({ cc, changes }) => {
  return (
    <Flex flexDirection="column">
      <Box>
        <Heading h={5}>{cc}.csv</Heading>
      </Box>
      <Box>
        {changes.map((c) => (
          <Flex key={c.url} pb={2}>
            <Box pr={2}>
              {c.action === 'add' && <MdEdit />}
              {c.action === 'delete' && <MdDelete />}
            </Box>
            <Box pr={2}>
              {c.action === 'add' && <Text>Edited/Added</Text>}
              {c.action === 'delete' && <Text>Deleted</Text>}
            </Box>
            <Box pr={2}>{c.url}</Box>
            <Box pr={2}>{c.category_description}</Box>
            <Box pr={2}>{c.notes}</Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  )
}

const Changes = () => {
  const { data, error } = useSWR(apiEndpoints.SUBMISSION_CHANGES, fetcher, {
    errorRetryCount: 2,
  })

  const { submissionState } = useContext(SubmissionContext)
  console.log('changes', data)
  return (
    <Flex flexDirection="column" my={2}>
      {data && !error && (
        <>
          <Box p={2}>
            {submissionState !== 'PR_OPEN' && (
              <>
                <Text>PR is OPEN</Text>
              </>
            )}
          </Box>
          <Box>
            {Object.keys(data.changes).map((cc) => (
              <ChangeSet key={cc} cc={cc} changes={data.changes[cc]} />
            ))}
          </Box>
        </>
      )}
    </Flex>
  )
}

export default Changes
