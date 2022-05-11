import React from 'react'
import countryUtil from 'country-util'

type CountryListProps = {
  defaultValue: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
}

type CountryEntry = {
  iso3166_alpha2: string
  iso3166_name: string
  name: string
}

const CountryList = ({ defaultValue, ...rest }: CountryListProps) => {
  return (
    <select {...rest} defaultValue={defaultValue}>
      {/* First option shows up only on home page (when defaultValue is not passed) */}
      <option value=''>Select a country</option>
      <option value='global'>Global</option>
      {countryUtil.countryList
        .sort((c1: CountryEntry, c2: CountryEntry) => c1.iso3166_name > c2.iso3166_name ? 1 : -1)
        .map(({ iso3166_alpha2, name }: CountryEntry, index: number) => (
          <option key={index} value={iso3166_alpha2} selected={defaultValue === iso3166_alpha2}>{name}</option>
        ))
      }
    </select>
  )
}

export default CountryList
