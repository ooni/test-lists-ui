import { Box, Flex, Link } from 'ooni-components'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const FooterWrapper = styled(Flex).attrs({
  justifyContent: 'space-between',
  flexDirection: ['column', 'row'],
  bg: 'blue9',
  color: 'gray2',
  px: [1, 4],
  py: 3,
  mt: 4,
})``

const FooterColumn = styled(Flex).attrs({
  flexDirection: 'column',
  justifyContent: 'center',
  mx: 3,
})``

const FooterItem = styled(Link).attrs({
  my: 1,
  mx: 3,
  color: 'gray2',
})`
&:hover {
  color: white;
}
`

const Footer = () => {
  const { formatMessage } = useIntl()
  return (
    <footer>
      <FooterWrapper>
        <FooterColumn color='white' fontSize={1}>
          <Box>
            © {new Date().getFullYear()} Open Observatory of Network
            Interference (OONI)
          </Box>
        </FooterColumn>
        <Flex
          my={[2, 0]}
          alignItems={['flex-start', 'center']}
          flexDirection={['column', 'row']}
        >
          <FooterItem href='https://ooni.org'>
            {formatMessage({ id: 'Footer.AboutOONI' })}
          </FooterItem>
          <FooterItem href='https://ooni.org/get-involved/contribute-test-lists'>
            {formatMessage({ id: 'Footer.AboutTestLists' })}{' '}
          </FooterItem>
          <FooterItem href='https://github.com/citizenlab/test-lists/'>
            {formatMessage({ id: 'Footer.TestListsGithub' })}
          </FooterItem>
          <FooterItem href='https://github.com/ooni/test-lists-ui'>
            {formatMessage({ id: 'Footer.SourceCode' })}
          </FooterItem>
        </Flex>
      </FooterWrapper>
    </footer>
  )
}

export default Footer
