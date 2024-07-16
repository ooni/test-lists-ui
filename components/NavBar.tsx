import Image from 'next/image'
import NextLink from 'next/link'
import { Box, Flex, Link } from 'ooni-components'
import OONILogo from 'ooni-components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'

import React, { useState } from 'react'
import styled from 'styled-components'

import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { getLocalisedLanguageName } from '../utils/i18n'
import QuickStartGuideModal from './QuickStartGuideModal'
import { useUser } from './lib/hooks'

export const getDirection = (locale) => {
  switch (locale) {
    case 'fa':
    case 'ar':
      return 'rtl'
    default:
      return 'ltr'
  }
}

const NavItem = styled(Box).attrs({
  fontSize: 2,
})`
  cursor: pointer;

  & a, & a:hover, & a:visited, & a:active {
    color: inherit;
    text-decoration: none;
  }
`

const LanguageSelect = styled.select`
color: ${(props) => props.theme.colors.white};
background: none;
border: none;
text-transform: capitalize;
cursor: pointer;
font-family: inherit;
font-size: inherit;
padding: 0;
outline: none;
appearance: none;
-webkit-appearance: none;
-moz-appearance: none;
-ms-appearance: none;
-o-appearance: none;
// reset option styling for browsers that apply it to its native styling (Brave)
> option {
  color: initial;
  opacity: initial;
}
`

const languages = process.env.LOCALES as unknown as string[]

const NavBar = () => {
  const router = useRouter()
  const { pathname, query, asPath } = router
  const { formatMessage } = useIntl()
  const { user, logout } = useUser()
  const [showModal, setShowModal] = useState(false)
  const { locale } = useIntl()

  const onLogout = (e) => {
    e.preventDefault()
    logout()
  }

  const handleLocaleChange = (event) => {
    const htmlEl = document.documentElement
    htmlEl.setAttribute('dir', getDirection(event.target.value))
    router.push({ pathname, query }, asPath, { locale: event.target.value })
  }

  return (
    <>
      <QuickStartGuideModal show={showModal} setShowModal={setShowModal} />
      <Flex bg='blue5' color='white' p={3} alignItems='center'>
        <NavItem>
          <NextLink href='/' passHref>
            <Image alt='OONI Logo' src={OONILogo} height={32} width={115} />
          </NextLink>
        </NavItem>
        <Flex alignItems='center' sx={{ gap: 3 }} ml='auto'>
          {user?.logged_in && (
            <>
              <Link
                href='#logout'
                color='white'
                onClick={() => setShowModal(true)}
              >
                {formatMessage({ id: 'NavBar.Help' })}
              </Link>
              <Link href='#logout' color='white' onClick={onLogout}>
                {formatMessage({ id: 'NavBar.Logout' })}
              </Link>
            </>
          )}
          <LanguageSelect onChange={handleLocaleChange} value={locale}>
            {languages.map((c) => (
              <option className='text-inherit opacity-100' key={c} value={c}>
                {getLocalisedLanguageName(c, c)}
              </option>
            ))}
          </LanguageSelect>
        </Flex>
      </Flex>
    </>
  )
}

export default NavBar
