import { territoryNames } from 'country-util'
import { Box, Flex, Text } from 'ooni-components'
import type React from 'react'
import { useContext } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import styled from 'styled-components'

import { useIntl } from 'react-intl'
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
  &:nth-child(even) {
    background: ${(props) => props.theme.colors.gray2};
  }
  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`

const Row: React.FunctionComponent<RowProps> = ({ change }) => {
  const { formatMessage } = useIntl()
  return (
    <OddEvenRow key={change.url} py={2}>
      <Flex width={[1, 2 / 8, 1 / 8]}>
        <Cell pr={2}>
          {change.action === 'add' && <MdEdit />}
          {change.action === 'delete' && <MdDelete />}
        </Cell>
        <Cell>
          {change.action === 'add' && (
            <Text>{formatMessage({ id: 'Changes.EditedAdded' })}</Text>
          )}
          {change.action === 'delete' && (
            <Text>{formatMessage({ id: 'Deleted' })}</Text>
          )}
        </Cell>
      </Flex>
      <Cell pr={2} width={[1, 3 / 8]}>
        <bdo dir='ltr'>{change.url}</bdo>
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
  const { formatMessage } = useIntl()

  let countryName = ''
  if (cc === 'global') {
    countryName = formatMessage({ id: 'CountryList.Global' })
  } else if (cc.length === 2) {
    countryName =
      cc.toUpperCase() in territoryNames
        ? territoryNames[cc.toUpperCase()]
        : cc.toUpperCase()
  }
  return (
    <Flex flexDirection='column'>
      <Box mx={3}>
        <h4>{countryName}</h4>
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
  const { formatMessage } = useIntl()
  const { changes } = useContext(SubmissionContext)
  const hasChanges = Object.keys(changes ?? {}).length > 0

  const headerRow: Change = {
    action: 'Action',
    url: formatMessage({ id: 'Changes.URL' }),
    category_description: formatMessage({ id: 'Changes.Category' }),
    date_added: formatMessage({ id: 'Changes.DateAdded' }),
    source: formatMessage({ id: 'Changes.Source' }),
    notes: formatMessage({ id: 'Changes.Notes' }),
  }

  if (!hasChanges) {
    return <></>
  }

  return (
    <Flex flexDirection='column' mt={2} pb={4}>
      <>
        <Box fontWeight='bold'>
          <Row change={headerRow} />
        </Box>
        <Box>
          {Object.keys(changes)
            .sort((cc1, cc2) => (cc2 === 'global' ? 1 : -1))
            .map((cc) => (
              <ChangeSet key={cc} cc={cc} changes={changes[cc]} />
            ))}
        </Box>
        <SubmitButton />
      </>
    </Flex>
  )
}

export default Changes
