import React, { useContext } from 'react'
import { Box, Flex, Text, Heading } from 'ooni-components'
import { MdDelete, MdEdit } from 'react-icons/md'
import { territoryNames } from 'country-util'
import styled from 'styled-components'

import { SubmissionContext } from './SubmissionContext'
import SubmitButton from './SubmitButton'

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

const OddEvenRow = styled(Flex)`
  :nth-child(even) {
    background: ${props => props.theme.colors.gray2};
  }
  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`

const Row: React.FunctionComponent<RowProps> = ({ change }) => {
  return (
    <OddEvenRow key={change.url} py={2}>
      <Flex width={[1, 2 / 8, 1 / 8]}>
        <Cell pr={2}>
          {change.action === 'add' && <MdEdit />}
          {change.action === 'delete' && <MdDelete />}
        </Cell>
        <Cell>
          {change.action === 'add' && <Text>Edited/Added</Text>}
          {change.action === 'delete' && <Text>Deleted</Text>}
        </Cell>
      </Flex>
      <Cell pr={2} width={[1, 3 / 8]}>
        {change.url}
      </Cell>
      <Cell pr={2} width={[1, 1 / 8, 2 / 8]}>
        {change.category_description}
      </Cell>
      <Cell pr={2} width={[1, 1 / 8]}>
        {change.source}
      </Cell>
      <Cell pr={2} width={[1, 2 / 8]}>
        {change.notes}
      </Cell>
    </OddEvenRow>
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
    <Flex flexDirection='column'>
      <Box mx={3}>
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
  const { changes } = useContext(SubmissionContext)
  const hasChanges = Object.keys(changes ?? {}).length > 0

  const headerRow: Change = {
    action: 'Action',
    url: 'URL',
    category_description: 'Category',
    date_added: 'Date Added',
    source: 'Source',
    notes: 'Notes',
  }

  if (!hasChanges) {
    return <></>
  }

  return (
    <Flex
      flexDirection='column'
      mt={2}
      pb={4}
    >
      <>
        <Box fontWeight='bold'>
          <Row change={headerRow} />
        </Box>
        <Box>
          {Object.keys(changes)
            .sort((cc1, cc2) => (cc2 === 'global' ? 1 : -1))
            .map((cc) => (
              <ChangeSet key={cc} cc={cc} changes={changes[cc]} />
            ))
          }
        </Box>
        <SubmitButton />
      </>
    </Flex>
  )
}

export default Changes
