import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Heading } from 'ooni-components'

import Layout from '../components/Layout'
import CountryList from '../components/submit/CountryList'
import UrlList from '../components/submit/UrlList'
import { PageContextProvider } from '../components/submit/SubmissionContext'
import { useNotifier } from '../components/lib/notifier'
import SubmitButton from '../components/submit/SubmitButton'
import Changes from '../components/submit/Changes'

export default function Submit () {
  const router = useRouter()
  const {
    query: { cc },
  } = router

  const countryCode = typeof cc === 'string' ? cc.toUpperCase() : cc

  const onCountryChange = useCallback(
    (e) => {
      const selectedCountry = e.target.value
      router.push(`/${selectedCountry}`, undefined, { shallow: true })
    },
    [router]
  )

  const { Notification } = useNotifier()

  return (
    <Layout title='Url Submission'>
      <Notification />
      <PageContextProvider countryCode={countryCode}>
        <Changes />
        <SubmitButton />
        <Heading h={1}>Test List</Heading>
        <CountryList defaultValue={countryCode} onChange={onCountryChange} />
        {countryCode && <UrlList cc={countryCode} />}
      </PageContextProvider>
    </Layout>
  )
}
