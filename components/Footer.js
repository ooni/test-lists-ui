import { Box, Flex, Link } from 'ooni-components'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const FooterWrapper = styled(Flex).attrs({
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

const FooterItem = ({ label, link }) => (
  <Link my={1} mx={3} color='gray2' href={link}>
    {label}
  </Link>
)

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
          ml={['initial', 'auto']}
          my={[2, 0]}
          alignItems={['flex-start', 'center']}
          flexDirection={['column', 'row']}
        >
          <FooterItem
            label={formatMessage({ id: 'Footer.AboutOONI' })}
            link='https://ooni.org'
          />
          <FooterItem
            label={formatMessage({ id: 'Footer.AboutTestLists' })}
            link='https://ooni.org/get-involved/contribute-test-lists'
          />
          <FooterItem
            label={formatMessage({ id: 'Footer.TestListsGithub' })}
            link='https://github.com/citizenlab/test-lists/'
          />
          <FooterItem
            label={formatMessage({ id: 'Footer.SourceCode' })}
            link='https://github.com/ooni/test-lists-ui'
          />
        </Flex>
      </FooterWrapper>
    </footer>
  )
}

export default Footer
