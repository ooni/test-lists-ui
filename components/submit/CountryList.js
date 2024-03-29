import React from 'react'
import countryUtil from 'country-util'
import { Select } from 'ooni-components'

const CountryList = ({ defaultValue, ...rest }) => {
  return (
    <Select {...rest} value={defaultValue}>
      <option value=''>Select a country</option>
      <option value='GLOBAL'>Global</option>
      {countryUtil.countryList
        .sort((c1, c2) => c1.iso3166_name > c2.iso3166_name ? 1 : -1)
        .map(({ iso3166_alpha2, name }, index) => (
          <option key={index} value={iso3166_alpha2}>{name}</option>
        ))
      }
    </Select>
  )
}

export default CountryList
