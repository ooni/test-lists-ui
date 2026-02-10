import NLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Flex, Heading, Link, Text } from 'ooni-components'
import React, { useCallback, useEffect, useState } from 'react'

import { useIntl } from 'react-intl'
import { mutate } from 'swr'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import LoginForm from '../components/LoginForm'
import { apiEndpoints, loginUser } from '../components/lib/api'
import { useUser } from '../components/lib/hooks'

const Login = () => {
  const { formatMessage } = useIntl()
  const [submitted, setSubmitted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { token, returnTo = '/' } = router.query

  const { user, loading } = useUser()

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (!loading && user?.logged_in) {
      router.replace('/')
    }
  }, [user, loading, router])

  const onLoginSubmit = useCallback(() => {
    // After submitting the login form
    setSubmitted(true)
  }, [])

  const afterLogin = useCallback(() => {
    mutate(apiEndpoints.ACCOUNT_METADATA, true)
    router.push(returnTo)
  }, [returnTo, router])

  // If there is a `token` URL param, call the login API
  // This fetches and sets the authentication cookie
  useEffect(() => {
    if (token) {
      const login = async (token) => {
        try {
          await loginUser(token)
          setLoggedIn(true)
          afterLogin()
        } catch (e) {
          console.log(e)
          setError(e.message)
        }
      }
      login(token)
    } else {
      // Reset any error messages from using invalid tokens
      setError(null)
    }
  }, [afterLogin, token])

  return (
    <Layout title='Login'>
      <Flex alignItems='center' flexDirection='column'>
        <Heading h={1} mt={3} mb={1} fontSize={[3, 5]}>
          {formatMessage({ id: 'Index.Title' })}
        </Heading>
        <Heading h={3} mt={1} fontWeight={300} fontSize={[2, 3]}>
          {formatMessage({ id: 'Index.Subtitle' })}
        </Heading>
      </Flex>
      <Flex mt={4} flexDirection='column'>
        {/* Before logging In */}
        {!token && !submitted && (
          <>
            <Text
              fontSize={1}
              mb={2}
              textAlign='center'
              sx={{ whiteSpace: 'pre-line', lineHeight: 1 }}
            >
              {formatMessage({ id: 'Login.Instructions' })}
            </Text>
            <LoginForm onLogin={onLoginSubmit} />
          </>
        )}
        {!token && submitted && (
          <Heading h={3} width={[1, 2 / 3]} textAlign='center' mx='auto'>
            {formatMessage({ id: 'Login.Submitted' })}
          </Heading>
        )}

        {/* While logging In */}
        {token && !loggedIn && !error && (
          <>
            <Loading size={96} dir={-1} speed={2} />
            <Heading h={2} my={2} mx='auto'>
              {formatMessage({ id: 'Login.LoggingIn' })}
            </Heading>
          </>
        )}

        {/* After loggin in */}
        {loggedIn && !error && (
          <>
            <Heading h={2} my={2} mx='auto'>
              {formatMessage({ id: 'Login.LoggedIn' })}
            </Heading>
          </>
        )}

        {/* Errors */}
        {error && (
          <Box width={[1, 1 / 3]} mx='auto' textAlign={'center'}>
            <Box mb={3} p={4} bg='red1'>
              {error}
            </Box>
            <NLink href='/login'>
              {formatMessage({ id: 'Login.TryAgain' })}
            </NLink>
          </Box>
        )}
      </Flex>
      <Flex alignItems='center' flexDirection='column'>
        <Box bg='blue5' mt={5} color='white' px={4} py={4} maxWidth='860px'>
          <Text
            fontSize={[1, 2]}
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.2,
              a: {
                color: 'white',
              },
            }}
          >
            {formatMessage(
              { id: 'Login.CTA' },
              {
                'probe-link': (string) => (
                  <NLink href='https://ooni.org/install'>{string}</NLink>
                ),
                'testlists-link': (string) => (
                  <NLink href='https://ooni.org/get-involved/contribute-test-lists'>
                    {string}
                  </NLink>
                ),
              },
            )}
          </Text>
        </Box>
      </Flex>
    </Layout>
  )
}

export default Login
