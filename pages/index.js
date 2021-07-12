import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Flex, Box, Heading } from 'ooni-components'

import Layout from '../components/Layout'
import CountryList from '../components/submit/CountryList'
import { useUser } from '../components/lib/hooks'
import LoginForm from '../components/LoginForm'
import Loading from '../components/Loading'

const Home = () => {
  const router = useRouter()
  const { user, loading } = useUser()

  const onCountryChange = useCallback((e) => {
    const selectedCountry = e.target.value
    router.push(`/${selectedCountry}`, undefined, { shallow: true })
  }, [router])

  return (
    <Layout title='OONI Test List Platform'>
      <Flex sx={{ height: '70vh' }} alignItems='center' justifyContent='center' flexDirection='column'>
        <Heading h={1}>OONI Test List platform</Heading>

        {!loading && user !== null && <>
          <Heading h={4} my={4}>Which country&apos;s test list would you like to contribute to?</Heading>
          <Box my={2}>
            <CountryList onChange={onCountryChange} />
          </Box>
        </>}

        {!loading && user === null && <>
          <Heading h={4} my={4}>Please login to start contributing</Heading>
          <LoginForm />
        </>}

        {loading && <Loading size={96} />}
      </Flex>
    </Layout>
  )
}

export default Home
