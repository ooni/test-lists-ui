import countryUtil from 'country-util'
import { Select } from 'ooni-components'
import React from 'react'
import { useIntl } from 'react-intl'

const CountryList = ({ defaultValue, ...rest }) => {
  const { formatMessage } = useIntl()

  return (
    <Select {...rest} value={defaultValue}>
      <option value=''>{formatMessage({ id: 'CountryList.Select' })}</option>
      <option value='GLOBAL'>
        {formatMessage({ id: 'CountryList.Global' })}
      </option>
      {countryUtil.countryList
        .sort((c1, c2) => (c1.iso3166_name > c2.iso3166_name ? 1 : -1))
        .map(({ iso3166_alpha2, name }) => (
          <option key={iso3166_alpha2} value={iso3166_alpha2}>
            {name}
          </option>
        ))}
    </Select>
  )
}

export default CountryList
