import { Box, Flex, Heading } from 'ooni-components'

const ErrorComponent = ({ children, ...rest }) => (
  <Flex
    my={2}
    px={4}
    pb={3}
    color='gray6'
    bg='red1'
    flexDirection='column'
    {...rest}
  >
    <Heading h={5}>Errors</Heading>
    <Box as='pre'>{children}</Box>
  </Flex>
)

export default ErrorComponent
