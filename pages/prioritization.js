import Link from 'next/link'
import { Flex, Box, Heading, Text, Button } from 'ooni-components'
import useSWR from 'swr'

import { fetcher, apiEndpoints } from '../components/lib/api'
import { useUser } from '../components/lib/hooks'

import Layout from '../components/Layout'
import List from '../components/List'
import AddRule from '../components/AddRule'

const swrOptions = {
  // dedupingInterval: 10 * 60 * 1000,
}

export default function Home () {
  const { user } = useUser()

  const isAdminUser = user?.role === "admin"

  const { data, error, isValidating, mutate } = useSWR(
    apiEndpoints.RULE_LIST,
    fetcher,
    swrOptions
  )

  return (
    <Layout title='URL Prioritization'>
      <Heading h={1} textAlign='center'>URL Priorities</Heading>
      <Flex alignItems='center' mb={3}>
        <button onClick={() => mutate()}> Refresh Data </button>
        <Text ml={3}>Status: {isValidating ? 'Loading...' : 'Ready'}</Text>
      </Flex>
      {isAdminUser ? <AddRule /> : <a href="https://forms.gle/oEUFkLxWtR6EbZmZ7" target="blank"><Button>Propose priorities</Button></a>}

      {data && <List data={data} mutateRules={mutate} />}
      {error && !data &&
        <Flex alignItems='center' p={4} bg='red1' flexDirection='column'>
          <Box>{error.status} {error.message}</Box>
          <Box><Link href='/login'> Login </Link></Box>
        </Flex>
      }
    </Layout>
  )
}
