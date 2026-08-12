import { territoryNames } from 'country-util'
import type { FunctionComponent } from 'react'
import { useContext } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'

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

type RowProps = {
  change: Change
}

const Row: FunctionComponent<RowProps> = ({ change }) => {
  const { formatMessage } = useIntl()
  return (
    <div className="changes-row flex py-2" key={change.url}>
      <div className="flex w-full md:w-1/4 lg:w-[12.5%]">
        <div className="pr-2">
          {change.action === 'add' && <MdEdit />}
          {change.action === 'delete' && <MdDelete />}
        </div>
        <div>
          {change.action === 'add' && (
            <span>{formatMessage({ id: 'Changes.EditedAdded' })}</span>
          )}
          {change.action === 'delete' && (
            <span>{formatMessage({ id: 'Deleted' })}</span>
          )}
        </div>
      </div>
      <div className="w-full pr-2 md:w-[37.5%]">
        <bdo dir='ltr'>{change.url}</bdo>
      </div>
      <div className="w-full pr-2 md:w-[12.5%] lg:w-1/4">
        {change.category_description}
      </div>
      <div className="w-full pr-2 md:w-[12.5%]">{change.source}</div>
      <div className="w-full pr-2 md:w-1/4">{change.notes}</div>
    </div>
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
    <div className="flex flex-col">
      <div className="mx-4">
        <h4>{countryName}</h4>
      </div>
      <div>
        {changes.map((change) => (
          <Row key={change.url} change={change} />
        ))}
      </div>
    </div>
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
    <div className="mt-2 flex flex-col pb-8">
      <div className="font-bold">
        <Row change={headerRow} />
      </div>
      <div>
        {Object.keys(changes)
          .sort((cc1, cc2) => (cc2 === 'global' ? 1 : -1))
          .map((cc) => (
            <ChangeSet key={cc} cc={cc} changes={changes[cc]} />
          ))}
      </div>
      <SubmitButton />
    </div>
  )
}

export default Changes
