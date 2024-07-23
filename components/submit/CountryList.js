import countryUtil from 'country-util'
import { Select } from 'ooni-components'
import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { getLocalisedRegionName } from '../../utils/i18n'

const CountryList = ({ defaultValue, ...rest }) => {
  const { formatMessage, locale } = useIntl()

  const countryOptions = useMemo(
    () =>
      countryUtil.countryList
        .map((cc) => ({
          label: getLocalisedRegionName(cc.iso3166_alpha2, locale),
          value: cc.iso3166_alpha2,
        }))
        .sort((a, b) => new Intl.Collator(locale).compare(a.label, b.label)),
    [locale],
  )

  return (
    <Select {...rest} value={defaultValue}>
      <option value=''>{formatMessage({ id: 'CountryList.Select' })}</option>
      <option value='GLOBAL'>
        {formatMessage({ id: 'CountryList.Global' })}
      </option>
      {countryOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  )
}

export default CountryList
