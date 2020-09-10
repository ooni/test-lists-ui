import { Flex, Box } from 'ooni-components'

const UrlEntry = ({
  url,
  category_code,
  country_code
}) => {

  return (
    <Flex my={2} p={3}
      justifyContent={['space-between']}
      sx={{ border: '1px solid', borderColor: 'gray6' }}
    >
      <Box width={2/3}>
        {url}
      </Box>
      <Box>
        {category_code}
      </Box>
      <Box>
        {country_code}
      </Box>
    </Flex>
  )
}
export default UrlEntry
