// import '../scripts/wdyr' // eslint-disable-line no-unused-vars
import { theme } from 'ooni-components'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import 'fontsource-fira-sans/latin.css'
import { AppProps } from 'next/app'

const GlobalStyle = createGlobalStyle`
  * {
    text-rendering: geometricPrecision;
    box-sizing: border-box;
  }
  body, html {
    margin: 0;
    padding: 0;
    font-family: "Fira Sans";
    font-size: 14px;
    height: 100%;
    background-color: #ffffff;
  }
`

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
