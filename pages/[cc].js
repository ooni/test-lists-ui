import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Heading } from 'ooni-components'

import Layout from '../components/Layout'
import CountryList from '../components/submit/CountryList'
import UrlList from '../components/submit/UrlList'
import SubmitButton from '../components/submit/SubmitButton'

export default function Submit () {
  const router = useRouter()
  const { query: { cc } } = router

  const countryCode = typeof cc === 'string' ? cc.toUpperCase() : cc

  const onCountryChange = useCallback((e) => {
    const selectedCountry = e.target.value
    router.push(`/${selectedCountry}`, undefined, { shallow: true })
  }, [router])

  return (
    <Layout title='Url Submission'>
      <Heading h={1}>Test List</Heading>
      <CountryList defaultValue={countryCode} onChange={onCountryChange} />
      <SubmitButton />
      {countryCode && <UrlList cc={countryCode} />}
    </Layout>
  )
}
