import NLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Flex, Heading, Text } from 'ooni-components'
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
      <Flex alignItems='center' justifyContent='center' flexDirection='column'>
        <Heading h={1} mt={3} fontSize={[3, 5]}>
          {formatMessage({ id: 'Index.Title' })}
        </Heading>
        {!loading && isLoggedIn && (
          <Flex
            alignItems='center'
            justifyContent='center'
            flexDirection='column'
            my='auto'
          >
            <Heading h={4} my={4}>
              {formatMessage({ id: 'Index.WhichContribution' })}
            </Heading>
            <Box my={2}>
              <CountryList onChange={onCountryChange} />
            </Box>
          </Flex>
        )}

        {loading && <Loading size={96} />}

        {isLoggedIn && (
          <Box
            bg='blue5'
            mt={5}
            color='white'
            px={4}
            py={4}
            fontSize={2}
            maxWidth='860px'
            sx={{
              a: {
                color: 'white',
              },
            }}
          >
            {formatMessage(
              { id: 'Index.NoticeMessage' },
              {
                strong: (string) => (
                  <Text fontWeight='bold' mb={3}>
                    {string}
                  </Text>
                ),
                link: (string) => (
                  <NLink href='https://ooni.org/install'>{string}</NLink>
                ),
              },
            )}
          </Box>
        )}

        <Box pt={2}>
          {!isLoggedIn && (
            <NLink href='/login'>
              <Button mr={2}>
                {formatMessage({ id: 'Index.RegisterButton' })}
              </Button>
            </NLink>
          )}
          <NLink href='/prioritization'>
            <Button hollow>
              {formatMessage({ id: 'Index.ShowPrioritiesButton' })}
            </Button>
          </NLink>
        </Box>
      </Flex>
    </Layout>
  )
}

export default Home
