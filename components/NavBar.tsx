import React, { useCallback, useState } from 'react'
import { useRouter, NextRouter } from 'next/router'
import NextLink from 'next/link'
import { Flex, Box, Link } from 'ooni-components'
import Image from 'next/image'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'
import styled from 'styled-components'

import QuickStartGuideModal from './QuickStartGuideModal'
import { useUser } from './lib/hooks'

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
  const [showModal, setShowModal] = useState(false)

  const onLogout = useCallback((e: MouseEvent) => {
    e.preventDefault()
    localStorage.removeItem('bearer')
    router.push('/login')
    mutate()
  }, [mutate, router])

  return (
    <>
      <QuickStartGuideModal show={showModal} setShowModal={setShowModal} />
      <Flex bg='blue5' color='white' p={3} alignItems='center'>
        <NavItem><NextLink href='/' passHref>
          <Image alt='OONI Logo' src={OONILogo} height='32px' width='115px' />
        </NextLink></NavItem>
        <Box ml='auto'>
        {!loading && user.loggedIn &&
            <>
              <Link href='#logout' color='white' mr={4} onClick={() => setShowModal(true)}>Help</Link>
              <Link href='#logout' color='white' onClick={onLogout}>Logout</Link>
            </>
        }
        </Box>
      </Flex>
    </>
  )
}

export default NavBar
