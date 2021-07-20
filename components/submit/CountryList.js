import React from 'react'
import countryUtil from 'country-util'

const CountryList = ({ defaultValue, ...rest }) => {
  return (
    <select {...rest} defaultValue={defaultValue}>
      {/* First option shows up only on home page (when defaultValue is not passed) */}
      <option value=''>Select a country</option>
      <option value='global'>Global</option>
      {countryUtil.countryList
        .sort((c1, c2) => c1.name > c2.name)
        .map(({ iso3166_alpha2, name }, index) => (
          <option key={index} value={iso3166_alpha2} selected={defaultValue === iso3166_alpha2}>{name}</option>
        ))
      }
    </select>
  )
}

export default CountryList
