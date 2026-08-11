import React from 'react'
import NextHead from 'next/head'

import NavBar from './NavBar'
import Footer from './Footer'

const Layout = ({ title = '', children }) => {
  return (
    <>
      <NextHead>
        <title>{title}</title>
      </NextHead>
      <div className="flex min-h-screen flex-col">
        <NavBar title={title} />
        <div className="container w-full flex-1">{children}</div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
