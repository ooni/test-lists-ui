import React from 'react'
import countryUtil from 'country-util'

const CountryList = ({ name, defaultValue, ...rest }) => {
  return (
    <select name={name} {...rest} placeholder='Placeholder'>
      {/* First option shows up only on home page (when defaultValue is not passed) */}
      <option value='' hidden disabled selected={defaultValue == null}>Select a country</option>
      <option value='global'>Global</option>
      {countryUtil.countryList.map(({ iso3166_alpha2, name }, index) => (
        <option key={index} value={iso3166_alpha2} selected={defaultValue === iso3166_alpha2}>{name}</option>
      ))}
    </select>
  )
}

export default CountryList
