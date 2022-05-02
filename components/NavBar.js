import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Flex, Box } from 'ooni-components'
import Image from 'next/image'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'
import styled from 'styled-components'

import { useUser } from './lib/hooks'
import Loading from './Loading'

const NavItem = styled(Box).attrs({
  fontSize: 2
})`
  cursor: pointer;

  & a, & a:hover, & a:visited, & a:active {
    color: inherit;
    text-decoration: none;
  }
`

const NavBar = () => {
  const router = useRouter()
  const { user, loading } = useUser()

  return (
    <>
      <Flex bg='blue5' color='white' p={3} alignItems='center'>
        <NavItem><Link href='/' passHref>
          <Image alt='OONI Logo' src={OONILogo} height='32px' width='115px' />
        </Link></NavItem>
        <Box sx={{ position: 'absolute', right: 8 }}>
        {!loading && user && 'nick' in user && <Box> {user.nick} ({user.role}) </Box>}
        {!loading && !user && (
          router.pathname !== '/login'
            ? (
            <NavItem><Link href='/login'>
              Login
            </Link></NavItem>
              )
            : null
        )}
        {loading && <Loading size={32} />}
        </Box>
      </Flex>
    </>
  )
}

export default NavBar
