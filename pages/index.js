import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { Container, Flex, Box, Heading, Text, theme } from 'ooni-components'
import useSWR from 'swr'
import { ThemeProvider } from 'styled-components'

import ResultList from '../components/ResultList'
import { fetcher } from '../components/lib/api'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}


export default function Home() {
  const [urls, setUrls] = useState(null)
  const [error, setError] = useState(null)

  // const {data, error, isValidating } = useSWR(['/api/_/url-priorities/list', { credentials: 'include' }], fetcher, swrOptions)

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await fetcher('/api/_/url-priorities/list', {
          // credentials: 'include',
          // mode: 'cors'
        })
        console.log(res)
      } catch (e) {
        setError(e.message)
      }
    }
    fetchUrls()
    // if (!data) {
    //   return
    // }
    // if (data.error) {
    //   setError(data.error)
    //   return
    // }

    // if ('results' in data && Array.isArray(data.results)) {
    //   setUrls(data.results.map((result, index) => ({...result, id: index})))
    // }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Heading h={1} textAlign='center'>URL Priorities</Heading>
        {/* {isValidating && <Text>Loading...</Text>} */}
        {urls && <ResultList urls={urls} />}
        {error && <Flex justifyContent='center' p={4} bg='red1'> { error } </Flex>}
      </Container>
    </ThemeProvider>
  )
}
