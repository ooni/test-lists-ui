import { useMemo } from 'react'
import Head from 'next/head'
import { Container, Flex, Box, Heading, Text, theme } from 'ooni-components'
import useSWR from 'swr'
import { ThemeProvider } from 'styled-components'

import ResultList from '../components/ResultList'

const baseUrl = 'http://ps1.ooni.io/api/v1/test-list/urls?limit=10'
const fetcher = url => fetch(url).then(r => r.json())
const swrOptions = {
  revalidateOnFocus: false
}

export default function Home() {
  const {data, error, isValidating } = useSWR(baseUrl, fetcher, swrOptions)

  const urls = useMemo(() => {
    if (!data) return []
    else return data.results.map((result, index) => ({...result, id: index}))
  }, [data])

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Heading h={1} textAlign='center'>URL Priorities</Heading>
        {isValidating && <Text>Loading...</Text>}
        {data && <ResultList urls={urls} />}
      </Container>
    </ThemeProvider>
  )
}
