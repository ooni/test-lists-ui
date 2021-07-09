import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Flex, Box, Heading } from 'ooni-components'

import Layout from '../components/Layout'
import CountryList from '../components/submit/CountryList'

const Home = () => {
  const router = useRouter()

  const onCountryChange = useCallback((e) => {
    const selectedCountry = e.target.value
    router.push(`/${selectedCountry}`, undefined, { shallow: true })
  }, [router])

  return (
    <Layout title='OONI Test List Platform'>
      <Flex sx={{ height: '70vh' }} alignItems='center' justifyContent='center' flexDirection='column'>
        <Heading h={1}>OONI Test List platform</Heading>
        <Heading h={4} my={4}>Which country&apos;s test list would you like to contribute to?</Heading>
        <Box my={2}>
          <CountryList onChange={onCountryChange} />
        </Box>
      </Flex>
    </Layout>
  )
}

export default Home
