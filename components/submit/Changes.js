import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Box, Flex, Text, Container, Heading, Link } from 'ooni-components'

import { MdDelete, MdEdit } from 'react-icons/md'

import { apiEndpoints, fetcher } from '../lib/api'
import Error from './Error'
import Table from './Table'
import { EditForm } from './EditForm'
import Loading from '../Loading'
import SubmitButton from './SubmitButton'
import { getPrettyErrorMessage } from '../lib/translateErrors'
import { SubmissionContext } from './SubmissionContext'
import { useNotifier } from '../lib/notifier'

const ChangeSet = ({cc, changes}) => {
  return <Flex flexDirection='column'>
    <Box>
      <Heading h={5}>{cc}.csv</Heading>
    </Box>
    <Box>
      {changes.map(c => (
        <Flex pb={2}>
          <Box pr={2}>
            {c.action === "add" && <MdEdit />}
            {c.action === "delete" && <MdDelete />}
          </Box>
          <Box pr={2}>
            {c.action === "add" && <Text>Edited/Added</Text>}
            {c.action === "delete" && <Text>Deleted</Text>}
          </Box>
          <Box pr={2}>
            {c.url}
          </Box>
          <Box pr={2}>
            {c.category_description}
          </Box>
          <Box pr={2}>
            {c.notes}
          </Box>
        </Flex>
      ))}
    </Box>
  </Flex>
}

const Changes = () => {
  const { data, error, mutate } = useSWR(
    apiEndpoints.SUBMISSION_CHANGES,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 6000,
      errorRetryInterval: 1000,
      errorRetryCount: 2
    }
  )

  const { submissionState, mutate: mutateSubmissionState } = useContext(SubmissionContext)
  console.log('changes', data)
  return (
    <Flex flexDirection='column' my={2}>
      {data && !error && (
        <>
          <Box p={2}>
            {submissionState !== 'PR_OPEN' &&
              <>
              <Text>PR is OPEN</Text>
              </>
            }
          </Box>
          <Box>
            {Object.keys(data.changes).map((cc) => (
              <ChangeSet cc={cc} changes={data.changes[cc]} />

            ))}
          </Box>
        </>
      )}
    </Flex>
  )
}

export default Changes
