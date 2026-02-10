// import '../scripts/wdyr'

import '@formatjs/intl-displaynames/polyfill'

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
import { Fira_Sans } from 'next/font/google'
import { useRouter } from 'next/router'
import { theme } from 'ooni-components'
import { useMemo } from 'react'
import { IntlProvider } from 'react-intl'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { UserProvider } from '../components/lib/hooks'

export const firaSans = Fira_Sans({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
})

export const getDirection = (locale) => {
  switch (locale) {
    case 'fa':
    case 'ar':
      return 'rtl'
    default:
      return 'ltr'
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    text-rendering: geometricPrecision;
    box-sizing: border-box;
  }
  body, html {
    margin: 0;
    padding: 0;
    font-size: 14px;
    height: 100%;
    background-color: #ffffff;
    font-family: ${firaSans.style.fontFamily};
  }
`

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
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </UserProvider>
    </IntlProvider>
  )
}

export default MyApp
