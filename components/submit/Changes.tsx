import React from 'react'
import useSWR from 'swr'
import { Box, Flex, Text, Heading } from 'ooni-components'
import { MdDelete, MdEdit } from 'react-icons/md'
import { territoryNames } from 'country-util'

import { apiEndpoints, fetcher } from '../lib/api'
import styled from 'styled-components'

type Change = {
  action: 'Action' | 'add' | 'delete'
  category_description: string
  date_added: string
  notes: string
  source: string
  url: string
}

const Cell = styled(Box)``

type RowProps = {
  change: Change
}

const Row: React.FunctionComponent<RowProps> = ({ change }) => {
  return (
    <Flex key={change.url} py={2}>
      <Flex width={1 / 8}>
        <Cell pr={2}>
          {change.action === 'add' && <MdEdit />}
          {change.action === 'delete' && <MdDelete />}
        </Cell>
        <Cell>
          {change.action === 'add' && <Text>Edited/Added</Text>}
          {change.action === 'delete' && <Text>Deleted</Text>}
        </Cell>
      </Flex>
      <Cell px={2} width={3 / 8}>
        {change.url}
      </Cell>
      <Cell pr={2} width={2 / 8}>
        {change.category_description}
      </Cell>
      <Cell pr={2} width={1 / 8}>
        {change.source}
      </Cell>
      <Cell pr={2} width={2 / 8}>
        {change.notes}
      </Cell>
    </Flex>
  )
}

const ChangeSet = ({ cc, changes }: { cc: string; changes: Change[] }) => {
  let countryName = ''
  if (cc === 'global') {
    countryName = 'Global'
  } else if (cc.length === 2) {
    countryName =
      cc.toUpperCase() in territoryNames
        ? territoryNames[cc.toUpperCase()]
        : cc.toUpperCase()
  }
  return (
    <Flex flexDirection="column">
      <Box>
        <Heading h={5}>{countryName}</Heading>
      </Box>
      <Box>
        {changes.map((change) => (
          <Row key={change.url} change={change} />
        ))}
      </Box>
    </Flex>
  )
}

const Changes = () => {
  const { data, error } = useSWR(apiEndpoints.SUBMISSION_CHANGES, fetcher, {
    errorRetryCount: 2,
  })

  const { global, ...otherLists } = data.changes
  const headerRow: Change = {
    action: 'Action',
    url: 'URL',
    category_description: 'Category',
    date_added: 'Date Added',
    source: 'Source',
    notes: 'Notes',
  }

  return (
    <Flex flexDirection="column" my={2}>
      {data && !error && (
        <>
          <Box fontWeight="bold">
            <Row change={headerRow} />
          </Box>
          <Box>
            <ChangeSet cc={'global'} changes={global} />
            {Object.keys(otherLists)
              .sort((cc1, cc2) => (cc2 === 'global' ? 1 : -1))
              .map((cc) => (
                <ChangeSet key={cc} cc={cc} changes={data.changes[cc]} />
              ))}
          </Box>
        </>
      )}
    </Flex>
  )
}

export default Changes
