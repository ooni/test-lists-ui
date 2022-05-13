import { Box, Heading, Link, Text } from 'ooni-components'
import instructions from './quick_start_guide.json'

const QuickStartGuide = ({ ...props }) => {
  return (
    <Box bg='blue5' color='white' px={5} py={2} {...props}>
      <Heading id="quickstart" h={4} textAlign="center">
        Quick Start Guide
        <Link href="#quickstart" mx={1} fontSize={1}>
          <sup>#</sup>
        </Link>
      </Heading>
      <Box as="ol" fontSize={1} pl={3}>
        {instructions.map((line, index) => (
          <Text as="li" key={index} my={2}>
            {line}
          </Text>
        ))}
      </Box>
    </Box>
  )
}

export default QuickStartGuide
