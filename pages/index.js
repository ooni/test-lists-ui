import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { Container, Flex, Box, Heading, Text, theme } from 'ooni-components'
import useSWR from 'swr'
import { ThemeProvider } from 'styled-components'

import { fetcher } from '../components/lib/api'
import List from '../components/List'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

export default function Home() {
  const [shouldFetch, setShouldFetch] = useState(true)

  const { data, error, isValidating } = useSWR(
    '/api/_/url-priorities/list',
    fetcher,
    swrOptions
  )

  console.log(data)
  
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Heading h={1} textAlign='center'>URL Priorities</Heading>
        {isValidating && <Text>Loading...</Text>}
        {data && <List data={data.rules} />}
        {error && !data && <Flex justifyContent='center' p={4} bg='red1'> { error } </Flex>}
      </Container>
    </ThemeProvider>
  )
}
