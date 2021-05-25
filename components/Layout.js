import React from 'react'
import NextHead from 'next/head'

import NavBar from './NavBar'
import { Container } from 'ooni-components'

const Layout = ({ title = '', children }) => {
  return (
    <>
      <NextHead>
        <title>{title}</title>
      </NextHead>
      <NavBar title={title} />
      <Container>
        {children}
      </Container>
    </>
  )
}

export default Layout