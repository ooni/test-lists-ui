import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Heading } from 'ooni-components'
import { Toaster } from 'react-hot-toast'

import Layout from '../components/Layout'
import CountryList from '../components/submit/CountryList'
import UrlList from '../components/submit/UrlList'
import { PageContextProvider } from '../components/submit/SubmissionContext'
import { useNotifier } from '../components/lib/notifier'

export default function Submit () {
  const router = useRouter()
  const { query: { cc } } = router

  const countryCode = typeof cc === 'string' ? cc.toUpperCase() : cc

  const onCountryChange = useCallback((e) => {
    const selectedCountry = e.target.value
    router.push(`/${selectedCountry}`, undefined, { shallow: true })
  }, [router])

  const { Notification } = useNotifier()

  return (
    <Layout title='Url Submission'>
      <Notification />
      <Heading h={1}>Test List</Heading>
      <CountryList defaultValue={countryCode} onChange={onCountryChange} />
      {countryCode && (
        <PageContextProvider>
          <UrlList cc={countryCode} />
        </PageContextProvider>
      )}
    </Layout>
  )
}
