import Link from 'next/link'
import useSWR from 'swr'

import { apiEndpoints, fetcher } from '../components/lib/api'
import { useUser } from '../components/lib/hooks'

import { useIntl } from 'react-intl'
import AddRule from '../components/AddRule'
import Layout from '../components/Layout'
import List from '../components/List'

const swrOptions = {
  // dedupingInterval: 10 * 60 * 1000,
}

export default function Home() {
  const { user } = useUser()
  const intl = useIntl()
  const isAdminUser = user?.role === 'admin'

  const { data, error, isValidating, mutate } = useSWR(
    apiEndpoints.RULE_LIST,
    fetcher,
    swrOptions,
  )

  return (
    <Layout title='URL Prioritization'>
      <h1 className="text-center">
        {intl.formatMessage({ id: 'Prioritization.UrlPriorities' })}
      </h1>
      <div className="mb-4 flex items-center">
        <button type='button' onClick={() => mutate()}>
          {intl.formatMessage({ id: 'Prioritization.Refresh' })}
        </button>
        <span className="ml-4">
          {intl.formatMessage({ id: 'Prioritization.Status' })}{' '}
          {isValidating
            ? intl.formatMessage({ id: 'Prioritization.Status.Loading' })
            : intl.formatMessage({ id: 'Prioritization.Status.Ready' })}
        </span>
      </div>
      {isAdminUser ? (
        <AddRule />
      ) : (
        <a
          href='https://forms.gle/oEUFkLxWtR6EbZmZ7'
          target='blank'
          className="btn btn-primary"
        >
          {intl.formatMessage({ id: 'Prioritization.ProposePriorities' })}
        </a>
      )}

      {data && <List data={data} mutateRules={mutate} />}
      {error && !data && (
        <div className="flex flex-col items-center bg-red-100 p-8">
          <p>
            {error.status} {error.message}
          </p>
          <p>
            <Link href='/login'>
              {intl.formatMessage({ id: 'LoginForm.Login' })}
            </Link>
          </p>
        </div>
      )}
    </Layout>
  )
}
