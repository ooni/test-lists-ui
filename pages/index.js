import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Flex, Box, Heading } from 'ooni-components'

import Layout from '../components/Layout'
import CountryList from '../components/submit/CountryList'
import { useUser } from '../components/lib/hooks'
import Loading from '../components/Loading'
import QuickStartGuide from '../components/submit/QuickStartGuide'

const Home = () => {
  const router = useRouter()
  const { user, loading } = useUser()

  const onCountryChange = useCallback((e) => {
    const selectedCountry = e.target.value
    router.push(`/${selectedCountry}`, undefined, { shallow: true })
  }, [router])

  return (
    <Layout title='OONI Test List Platform'>
      <Flex alignItems='center' justifyContent='center' flexDirection='column'>
        <Heading h={1} mt={3}>OONI Test List platform</Heading>

        {!loading && user !== null &&
          <Flex alignItems='center' justifyContent='center' flexDirection='column' my='auto'>
            <Heading h={4} my={4}>Which country&apos;s test list would you like to contribute to?</Heading>
            <Box my={2}>
              <CountryList onChange={onCountryChange} />
            </Box>
          </Flex>
        }

        {loading && <Loading size={96} />}

        <Flex flexDirection='column' px={[0, 5]} py={4}>
          <QuickStartGuide />
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Home
