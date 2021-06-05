import { Box, Flex, Heading } from 'ooni-components'

const Error = ({ children, ...rest }) => (
  <Flex my={2} px={4} pb={3} bg='red1' flexDirection='column' {...rest}>
    <Heading h={4}>Errors</Heading>
    <Box as='pre'>
      {children}
    </Box>
  </Flex>
)

export default Error
