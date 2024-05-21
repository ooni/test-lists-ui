import NLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Flex, Heading, Link, Text } from 'ooni-components'
import { useCallback } from 'react'

import Layout from '../components/Layout'
import Loading from '../components/Loading'
import { useUser } from '../components/lib/hooks'
import CountryList from '../components/submit/CountryList'

const Home = () => {
  const router = useRouter()
  const { user, loading } = useUser({ periodicTokenRefresh: true })

  const isLoggedIn = user?.logged_in
  const onCountryChange = useCallback((e) => {
    const selectedCountry = e.target.value
    router.push(`/${selectedCountry}`, undefined, { shallow: true })
  }, [router])

  return (
    <Layout title='Test Lists Editor'>
      <Flex alignItems='center' justifyContent='center' flexDirection='column'>
        <Heading h={1} mt={3} fontSize={[3, 5]}>Test Lists Editor</Heading>
        {!loading && isLoggedIn &&
          <Flex alignItems='center' justifyContent='center' flexDirection='column' my='auto'>
            <Heading h={4} my={4}>Which country&apos;s test list would you like to contribute to?</Heading>
            <Box my={2}>
              <CountryList onChange={onCountryChange} />
            </Box>
          </Flex>
        }

        {loading && <Loading size={96} />}

        {isLoggedIn && <Box bg='blue5' mt={5} color='white' px={4} py={4} fontSize={2} maxWidth="860px">
          <Text fontWeight='bold'>Important:</Text>
          <p>Internationally-relevant websites (such as facebook.com) are tested by <NLink href="https://ooni.org/install">OONI Probe</NLink> users globally, and are only meant to be included in the Global test list.</p>
        </Box>}

        <Box pt={2}>
          {!isLoggedIn && <NLink href="/login"><Button mr={2}>Register to contribute URLs</Button></NLink>}
          <NLink href="/prioritization"><Button hollow>Show URL priorities</Button></NLink>
        </Box>
      </Flex>
    </Layout>
  )
}

export default Home
