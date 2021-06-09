import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, Heading } from 'ooni-components'

import Layout from '../../components/Layout'
import CountryList from '../../components/submit/CountryList'
import UrlList from '../../components/submit/UrlList'
import State from '../../components/submit/State'

export default function Submit () {
  const router = useRouter()
  const { query: { cc } } = router

  const onCountryChange = useCallback((e) => {
    const selectedCountry = e.target.value
    router.push(`/submit/${selectedCountry}`, undefined, { shallow: true })
  }, [router])

  return (
    <Layout title='Url Submission'>
      <Flex alignItems='center'>
        <Heading h={1}>Test List <CountryList defaultValue={cc} onChange={onCountryChange} /></Heading>
        <Box ml='auto'><State /></Box>
      </Flex>
      {cc && <UrlList cc={cc} />}
    </Layout>
  )
}
