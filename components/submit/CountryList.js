import countryUtil from 'country-util'
import styled from 'styled-components'

const StyledSelect = styled.select`
  font-size: inherit;
  border: 0;
  & > option {
    font-size: initial;
  }
`

const CountryList = ({ name, defaultValue, ...rest }) => {
  return (
    <StyledSelect name={name} {...rest}>
      <option value='global' selected>Global</option>
      {countryUtil.countryList.map(({ iso3166_alpha2, name }, index) => (
        <option key={index} value={iso3166_alpha2} selected={defaultValue === iso3166_alpha2}>{name}</option>
      ))}
    </StyledSelect>
  )
}

export default CountryList
