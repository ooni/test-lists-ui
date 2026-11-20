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
      <div className='flex flex-col items-center justify-center'>
        <h1 className='mt-4 mb-12'>{formatMessage({ id: 'Index.Title' })}</h1>
        {!loading && isLoggedIn && (
          <div className='my-auto flex flex-col items-center justify-center'>
            <h4 className='my-4'>
              {formatMessage({ id: 'Index.WhichContribution' })}
            </h4>
            <div className='my-2'>
              <CountryList onChange={onCountryChange} />
            </div>
          </div>
        )}

        {loading && <Loading size={96} />}

        {isLoggedIn && (
          <div className='text-lg mt-8 max-w-215 bg-blue-500 px-6 py-6 text-white [&_a]:text-white [&_a]:underline'>
            {formatMessage(
              { id: 'Index.NoticeMessage' },
              {
                strong: (string) => (
                  <span className='mb-4 font-bold block'>{string}</span>
                ),
                link: (string) => (
                  <NLink href='https://ooni.org/install'>{string}</NLink>
                ),
              },
            )}
          </div>
        )}

        <div className='pt-2'>
          {!isLoggedIn && (
            <NLink href='/login' className='btn btn-primary mb-8'>
              {formatMessage({ id: 'Index.RegisterButton' })}
            </NLink>
          )}
          <NLink href='/prioritization' className='btn btn-primary-hollow'>
            {formatMessage({ id: 'Index.ShowPrioritiesButton' })}
          </NLink>
        </div>
      </div>
    </Layout>
  )
}

export default Home
