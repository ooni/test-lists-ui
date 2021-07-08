import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, Heading } from 'ooni-components'

import Layout from '../../components/Layout'
import CountryList from '../../components/submit/CountryList'
import UrlList from '../../components/submit/UrlList'
import SubmitButton from '../../components/submit/SubmitButton'

export default function Submit () {
  const router = useRouter()
  const { query: { cc } } = router

  const countryCode = typeof cc === 'string' ? cc.toUpperCase() : cc

  const onCountryChange = useCallback((e) => {
    const selectedCountry = e.target.value
    router.push(`/submit/${selectedCountry}`, undefined, { shallow: true })
  }, [router])

  return (
    <Layout title='Url Submission'>
      <Flex alignItems='center'>
        <Heading h={1}>Test List <CountryList defaultValue={countryCode} onChange={onCountryChange} /></Heading>
      </Flex>
      <SubmitButton />
      {countryCode && <UrlList cc={countryCode} />}
    </Layout>
  )
}
