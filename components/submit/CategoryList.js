import { Select } from 'ooni-components'
import { useIntl } from 'react-intl'
import categories from '../lib/category_codes.json'

const CategoryList = ({ name, defaultValue, ...rest }) => {
  const { formatMessage } = useIntl()

  return (
    <Select name={name} defaultValue={defaultValue} {...rest}>
      <option value=''>{formatMessage({ id: 'CategoryList.Select' })}</option>
      {Object.entries(categories)
        .sort((c1, c2) => (c1[1] > c2[1] ? 1 : -1))
        .map(([code]) => (
          <option
            key={code}
            value={code}
            title={formatMessage({ id: `CategoryCode.${code}.Description` })}
          >
            {formatMessage({ id: `CategoryCode.${code}.Name` })}
          </option>
        ))}
    </Select>
  )
}

export default CategoryList
