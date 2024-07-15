import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Modal,
  Text,
} from 'ooni-components'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const StyledModal = styled(Modal).attrs({
  minWidth: 340,
})``

const QuickStartGuideModal = ({ show, setShowModal }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledModal show={show}>
      <Container p={[0, 3]}>
        <Flex flexDirection='column'>
          <Heading h={4} textAlign='center'>
            {formatMessage({ id: 'QuickStartGuide.Title' })}
          </Heading>
          <Box as='ol' fontSize={1} pl={3} my={[0, 2]} px={5}>
            {[...Array(6)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Text as='li' key={i} my={2}>
                {formatMessage({ id: `QuickStartGuide.${i + 1}` })}
              </Text>
            ))}
          </Box>
        </Flex>
      </Container>
      <Flex justifyContent='center' my={3}>
        <Button mx={3} width={1 / 3} onClick={() => setShowModal(false)}>
          <Text fontWeight='bold'>
            {formatMessage({ id: 'QuickStartGuide.Close' })}
          </Text>
        </Button>
      </Flex>
    </StyledModal>
  )
}

export default QuickStartGuideModal
