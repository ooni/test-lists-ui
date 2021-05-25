import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Flex, Box, Text, Modal } from 'ooni-components'
import styled from 'styled-components'

import { useUser } from './lib/hooks'
import { LoginModal } from './LoginForm'

const NavItem = styled(Box).attrs({
  fontSize: 2
})`
  cursor: pointer;

  & a, & a:hover, & a:visited, & a:active {
    color: inherit;
    text-decoration: none;
  }
`

const NavBar = ({ title }) => {
  const router = useRouter()
  const [showLoginModal, setShowLogin] = useState(false)
  const {
    loading,
    loggedOut,
    user,
    mutate,
  } = useUser()

  const showLogin = useCallback(() => setShowLogin(true), [])
  const hideLogin = useCallback(() => setShowLogin(false), [])

  return (
    <>
      <Flex bg='blue5' color='white' p={3} alignItems='center'>
        <NavItem sx={{ position: 'absolute'}}><Link href='/'>OONI Logo</Link></NavItem>
        <Box fontSize={3} mx='auto'> {title} </Box>
        <Box sx={{ position: 'absolute', right: 8 }}>
        {user ? (
          <Box> {user.nick} ({user.role}) </Box>
        ):(
          router.pathname !== '/login' ? (
            <NavItem><Link href='/login'>
              Login
            </Link></NavItem>
          ) : null
        )}
        </Box>
      </Flex>
      <LoginModal isShowing={showLoginModal} hide={hideLogin} />
    </>
  )
}

export default NavBar