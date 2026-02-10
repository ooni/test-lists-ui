import { useRouter } from 'next/router'
import { Heading } from 'ooni-components'
import { useCallback, useEffect } from 'react'

import { useIntl } from 'react-intl'
import Layout from '../../components/Layout'
import { useUser } from '../../components/lib/hooks'
import { useNotifier } from '../../components/lib/notifier'
import Changes from '../../components/submit/Changes'
import CountryList from '../../components/submit/CountryList'
import { PageContextProvider } from '../../components/submit/SubmissionContext'
import UrlList from '../../components/submit/UrlList'

export default function Submit() {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const {
    query: { cc },
  } = router

  const { user, loading } = useUser()

  const countryCode = typeof cc === 'string' ? cc.toUpperCase() : cc

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  const onCountryChange = useCallback(
    (e) => {
      console.log('bebe')
      const selectedCountry = e.target.value
      router.push(`/country/${selectedCountry}`, undefined, { shallow: true })
    },
    [router],
  )

  const { Notification } = useNotifier()

  return (
    <Layout title='Url Submission'>
      <Notification />
      <PageContextProvider countryCode={countryCode}>
        <Changes />
        <Heading h={1}>{formatMessage({ id: 'Country.TestList' })}</Heading>
        <CountryList defaultValue={countryCode} onChange={onCountryChange} />
        {countryCode && <UrlList cc={countryCode} />}
      </PageContextProvider>
    </Layout>
  )
}
