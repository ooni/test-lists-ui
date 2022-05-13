import * as React from 'react'
import NextHead from 'next/head'
import styled from 'styled-components'
import { Container, Flex } from 'ooni-components'

import NavBar from './NavBar'
import Footer from './Footer'

const PageWrapper = styled(Flex)`
  flex-direction: column;
  min-height: 100vh;
`

type LayoutProps = {
  title: string,
  children: React.ReactNode
}
const Layout: React.FunctionComponent<LayoutProps> = ({ title = '', children }) => {
  return (
    <>
      <NextHead>
        <title>{title}</title>
      </NextHead>
      <PageWrapper>
        <NavBar />
        <Container sx={{ flex: 1, width: '100%' }}>
          {children}
        </Container>
        <Footer />
      </PageWrapper>
    </>
  )
}

export default Layout
