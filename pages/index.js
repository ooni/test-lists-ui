import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Container, Flex, Box, Heading, Text, theme } from 'ooni-components'
import useSWR from 'swr'
import { ThemeProvider } from 'styled-components'

import { fetcher } from '../components/lib/api'
import Layout from '../components/Layout'
import List from '../components/List'
import { useUser } from '../components/lib/hooks'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

export default function Home() {
  const [shouldFetch, setShouldFetch] = useState(true)
  // const { user } = useUser()

  const { data, error, isValidating, mutate } = useSWR(
    '/api/_/url-priorities/list',
    fetcher,
    swrOptions
  )

  return (
    <Layout title='Dashboard'>
      <Heading h={1} textAlign='center'>URL Priorities</Heading>
      {isValidating && <Text>Loading...</Text>}
      {data && <List initialData={data.rules} mutateData={mutate} />}
      {error && !data &&
        <Flex alignItems='center' p={4} bg='red1' flexDirection='column'>
          <Box>{error.status} {error.message}</Box> 
          <Box><Link href='/login'> Login </Link></Box>
        </Flex>
      }
    </Layout>
  )
}
