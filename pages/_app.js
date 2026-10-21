import 'styles/globals.css'

import '@formatjs/intl-displaynames/polyfill.js'

import '@formatjs/intl-displaynames/locale-data/ar'
import '@formatjs/intl-displaynames/locale-data/de'
import '@formatjs/intl-displaynames/locale-data/en'
import '@formatjs/intl-displaynames/locale-data/es'
import '@formatjs/intl-displaynames/locale-data/fr'
import '@formatjs/intl-displaynames/locale-data/km'
import '@formatjs/intl-displaynames/locale-data/my'
import '@formatjs/intl-displaynames/locale-data/pt'
import '@formatjs/intl-displaynames/locale-data/ru'
import '@formatjs/intl-displaynames/locale-data/tr'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { IntlProvider } from 'react-intl'
import { UserProvider } from '../components/lib/hooks'
import { firaSans } from '../lib/firaSans'

export const getDirection = (locale) => {
  switch (locale) {
    case 'fa':
    case 'ar':
      return 'rtl'
    default:
      return 'ltr'
  }
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { locale = 'en', defaultLocale } = router

  const messages = useMemo(() => {
    try {
      const messages = require(`../public/static/lang/${locale}.json`)
      const defaultMessages = require(
        `../public/static/lang/${defaultLocale}.json`,
      )

      const mergedMessages = Object.assign({}, defaultMessages, messages)
      return mergedMessages
    } catch (e) {
      console.error(`Failed to load messages for ${locale}: ${e.message}`)
      const defaultMessages = require(
        `../public/static/lang/${defaultLocale}.json`,
      )
      return defaultMessages
    }
  }, [locale, defaultLocale])

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messages}
    >
      <UserProvider>
        <main className={firaSans.className}>
          <Component {...pageProps} />
        </main>
      </UserProvider>
    </IntlProvider>
  )
}

export default MyApp
