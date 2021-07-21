import { Flex, Box, Link } from 'ooni-components'
import styled from 'styled-components'

const FooterWrapper = styled(Flex).attrs({
  flexDirection: ['column', 'row'],
  bg: 'blue9',
  color: 'gray2',
  px: [1, 4],
  py: 3,
  mt: 4
})``

const FooterColumn = styled(Flex).attrs({
  flexDirection: 'column',
  justifyContent: 'center',
  mx: 3
})``

const FooterItem = ({ label, link }) => (
  <Link my={1} mx={3} color='gray2' href={link}>{label}</Link>
)

const Footer = () => (
  <footer>
    <FooterWrapper>
      <FooterColumn color='white' fontSize={1}>
        <Box>
          © 2020 Open Observatory of Network Interference (OONI)
        </Box>
      </FooterColumn>
      <Flex ml={['initial', 'auto']} my={[2, 0]} alignItems={['flex-start', 'center']} flexDirection={['column', 'row']}>
        <FooterItem label='About OONI' link='https://ooni.org' />
        <FooterItem label='Code of Conduct' link='https://github.com/ooni/ooni.org/blob/master/CODE_OF_CONDUCT.md#ooni-code-of-conduct' />
        <FooterItem label='Test Lists on Github' link='https://github.com/citizenlab/test-lists/' />
        <FooterItem label='Source Code' link='https://github.com/ooni/url-prioritization' />
      </Flex>
    </FooterWrapper>
  </footer>
)

export default Footer
