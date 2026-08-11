import NLink from 'next/link'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { useIntl } from 'react-intl'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import { useUser } from '../components/lib/hooks'
import CountryList from '../components/submit/CountryList'

const Home = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { user, loading } = useUser({ periodicTokenRefresh: true })

  const isLoggedIn = user?.logged_in
  const onCountryChange = useCallback(
    (e) => {
      const selectedCountry = e.target.value
      router.push(`/country/${selectedCountry}`, undefined, { shallow: true })
    },
    [router],
  )

  return (
    <Layout title={formatMessage({ id: 'Index.Title' })}>
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-4 text-base md:text-xl">
          {formatMessage({ id: 'Index.Title' })}
        </h1>
        {!loading && isLoggedIn && (
          <div className="my-auto flex flex-col items-center justify-center">
            <h4 className="my-4">{formatMessage({ id: 'Index.WhichContribution' })}</h4>
            <div className="my-2">
              <CountryList onChange={onCountryChange} />
            </div>
          </div>
        )}

        {loading && <Loading size={96} />}

        {isLoggedIn && (
          <div className="mt-8 max-w-[860px] bg-blue-500 px-8 py-8 text-sm text-white [&_a]:text-white">
            {formatMessage(
              { id: 'Index.NoticeMessage' },
              {
                strong: (string) => (
                  <p className="mb-4 font-bold">{string}</p>
                ),
                link: (string) => (
                  <NLink href='https://ooni.org/install'>{string}</NLink>
                ),
              },
            )}
          </div>
        )}

        <div className="pt-2">
          {!isLoggedIn && (
            <NLink href='/login' className="btn btn-primary mr-2">
              {formatMessage({ id: 'Index.RegisterButton' })}
            </NLink>
          )}
          <NLink href='/prioritization' className="btn btn-primary-hollow">
            {formatMessage({ id: 'Index.ShowPrioritiesButton' })}
          </NLink>
        </div>
      </div>
    </Layout>
  )
}

export default Home
