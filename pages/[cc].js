import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Heading, Box } from 'ooni-components'

import Layout from '../components/Layout'
import CountryList from '../components/submit/CountryList'
import UrlList from '../components/submit/UrlList'
import { PageContextProvider } from '../components/submit/SubmissionContext'
import { useNotifier } from '../components/lib/notifier'
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
        <Heading h={2} mt={3} mb={4}>Test List Editor</Heading>
        <Changes />
        <Heading h={4} mb={3}>Country</Heading>
        <Box mb={4}>
          <CountryList defaultValue={countryCode} onChange={onCountryChange} />
        </Box>
        {countryCode && <UrlList cc={countryCode} />}
      </PageContextProvider>
    </Layout>
  )
}
