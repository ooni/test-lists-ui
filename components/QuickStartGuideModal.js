import { Box, Heading, Text, Modal, Container, Flex, Button } from 'ooni-components'
import styled from 'styled-components'
import instructions from './submit/quick_start_guide.json'

const StyledModal = styled(Modal).attrs({
  minWidth: 340
})``

const QuickStartGuideModal = ({ show, setShowModal }) => {
  return (
    <StyledModal show={show}>
      <Container p={[0, 3]}>
        <Flex flexDirection='column'>
          <Heading h={4} textAlign='center'>
            Quick Start Guide
          </Heading>
          <Box as="ol" fontSize={1} pl={3} my={[0, 2]} px={5}>
            {instructions.filter((_, i) => i > 1).map((line, index) => (
              <Text as="li" key={index} my={2}>
                {line}
              </Text>
            ))}
          </Box>
        </Flex>
      </Container>
      <Flex justifyContent='center' my={3}>
        <Button mx={3} width={1 / 3} onClick={() => setShowModal(false)}>
          <Text fontWeight='bold'>Close</Text>
        </Button>
      </Flex>
    </StyledModal>
  )
}

export default QuickStartGuideModal
