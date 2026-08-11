import Image from 'next/image'
import NextLink from 'next/link'
import OONILogo from 'ooni-components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'

import React, { useState } from 'react'

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

const languages = JSON.parse(process.env.LOCALES ?? '[]') as string[]

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
      <header className="flex items-center justify-between bg-blue-500 p-4 text-white">
        <div className="cursor-pointer text-sm [&_a]:text-inherit [&_a:active]:text-inherit [&_a:hover]:text-inherit [&_a:visited]:text-inherit [&_a]:no-underline">
          <NextLink href='/' passHref>
            <Image alt='OONI Logo' src={OONILogo} height={32} width={115} />
          </NextLink>
        </div>
        <div className="flex items-center gap-4">
          {user?.logged_in && (
            <>
              <a
                href='#logout'
                className="text-white"
                onClick={() => setShowModal(true)}
              >
                {formatMessage({ id: 'NavBar.Help' })}
              </a>
              <a href='#logout' className="text-white" onClick={onLogout}>
                {formatMessage({ id: 'NavBar.Logout' })}
              </a>
            </>
          )}
          <select
            className="cursor-pointer appearance-none border-none bg-transparent p-0 text-inherit capitalize outline-none [&>option]:text-inherit [&>option]:opacity-100"
            onChange={handleLocaleChange}
            value={locale}
          >
            {languages.map((c) => (
              <option key={c} value={c}>
                {getLocalisedLanguageName(c, c)}
              </option>
            ))}
          </select>
        </div>
      </header>
    </>
  )
}

export default NavBar
