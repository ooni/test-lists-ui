import { Flex, Box, Link } from 'ooni-components'
import styled from 'styled-components'

const FooterContainer = styled(Flex)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`

const FooterColumn = styled(Flex).attrs({
  flexDirection: 'column',
  mx: 3
})``

const FooterItem = ({ label, link }) => (
  <Link my={1} color='gray2' href={link}>{label}</Link>
)

const Footer = () => (
  <FooterContainer as='footer' bg='blue9' color='gray2' px={4} py={3}>
    <FooterColumn width={1/3} color='white' fontSize={1}>
      <Box my={1}>
        Global community measuring internet censorship around the world.
      </Box>
      <Box>
        © 2020 Open Observatory of Network Interference (OONI)
      </Box>
    </FooterColumn>
    <FooterColumn>
      <FooterItem label='About OONI' link='https://ooni.org' />
      <FooterItem label='Code of Conduct' link='https://github.com/ooni/ooni.org/blob/master/CODE_OF_CONDUCT.md#ooni-code-of-conduct' />
      <FooterItem label='Test Lists on Github' link='https://github.com/citizenlab/test-lists/' />
      <FooterItem label='Source Code' link='https://github.com/ooni/url-prioritization' />
    </FooterColumn>
  </FooterContainer>
)

export default Footer
