import Link from 'next/link'
import { Box, Button, Flex, Heading, Text } from 'ooni-components'
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
      <Heading h={1} textAlign='center'>
        {intl.formatMessage({ id: 'Prioritization.UrlPriorities' })}
      </Heading>
      <Flex alignItems='center' mb={3}>
        <button type='button' onClick={() => mutate()}>
          {intl.formatMessage({ id: 'Prioritization.Refresh' })}
        </button>
        <Text ml={3}>
          {intl.formatMessage({ id: 'Prioritization.Status' })}{' '}
          {isValidating
            ? intl.formatMessage({ id: 'Prioritization.Status.Loading' })
            : intl.formatMessage({ id: 'Prioritization.Status.Ready' })}
        </Text>
      </Flex>
      {isAdminUser ? (
        <AddRule />
      ) : (
        <a href='https://forms.gle/oEUFkLxWtR6EbZmZ7' target='blank'>
          <Button>
            {intl.formatMessage({ id: 'Prioritization.ProposePriorities' })}
          </Button>
        </a>
      )}

      {data && <List data={data} mutateRules={mutate} />}
      {error && !data && (
        <Flex alignItems='center' p={4} bg='red1' flexDirection='column'>
          <Box>
            {error.status} {error.message}
          </Box>
          <Box>
            <Link href='/login'>
              {intl.formatMessage({ id: 'LoginForm.Login' })}
            </Link>
          </Box>
        </Flex>
      )}
    </Layout>
  )
}
