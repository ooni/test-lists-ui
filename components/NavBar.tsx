import React, { useCallback } from 'react'
import { useRouter, NextRouter } from 'next/router'
import NextLink from 'next/link'
import { Flex, Box, Link } from 'ooni-components'
import Image from 'next/image'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'
import styled from 'styled-components'

import { useUser } from './lib/hooks'
import { useNotifier } from './lib/notifier'
import { logoutUser } from './lib/api'
import { IApiError } from './types'

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
  const router: NextRouter = useRouter()
  const { user, loading, mutate } = useUser()
  const { notify } = useNotifier()

  const onLogout = useCallback((e: MouseEvent) => {
    e.preventDefault()
    logoutUser().then(() => {
      console.debug('Logged out')
      router.push('/login')
    }).catch((e: IApiError) => {
      notify.error(`Logout failed: ${e}`)
    }).finally(() => {
      mutate()
    })
  }, [mutate, notify, router])

  return (
    <>
      <Flex bg='blue5' color='white' p={3} alignItems='center'>
        <NavItem><NextLink href='/' passHref>
          <Image alt='OONI Logo' src={OONILogo} height='32px' width='115px' />
        </NextLink></NavItem>
        <Box ml='auto'>
        {!loading && user && 'nick' in user &&
            <Link href='#logout' color='white' onClick={onLogout}>Logout ({user.nick})</Link>
        }
        </Box>
      </Flex>
    </>
  )
}

export default NavBar
