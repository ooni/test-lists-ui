// import '../scripts/wdyr' // eslint-disable-line no-unused-vars
import { Fira_Sans } from 'next/font/google'
import { theme } from 'ooni-components'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { UserProvider } from '../components/lib/hooks'

export const firaSans = Fira_Sans({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
})

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

function MyApp ({ Component, pageProps }) {
  return (
    <UserProvider>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  )
}

export default MyApp
