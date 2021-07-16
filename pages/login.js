import React, { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Heading } from 'ooni-components'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Layout from '../components/Layout'
import LoginForm from '../components/LoginForm'
import { apiEndpoints, loginUser } from '../components/lib/api'
import { mutate } from 'swr'
import Loading from '../components/Loading'
import { useUser } from '../components/lib/hooks'

const Login = () => {
  const [submitted, setSubmitted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { token, returnTo = '/' } = router.query

  const { user, loading } = useUser

  useEffect(() => {
    if (!loading && user !== null) {
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
          setError(e)
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
      <Flex my={6} justifyContent='center' alignItems='center' flexDirection='column'>
        {/* Before logging In */}
        {!token && !submitted &&
          <LoginForm onLogin={onLoginSubmit} />
        }
        {!token && submitted &&
          <Heading h={3} width={[1, 2 / 3]} textAlign='center'>
            Your login request has been submitted. Please check your email for a link to activate and log in to your account.
          </Heading>
        }

        {/* While logging In */}
        {token && !loggedIn && !error &&
          <>
            <Loading size={96} dir={-1} speed={2} />
            <Heading h={2} my={2}> Logging in... </Heading>
          </>
        }

        {/* After loggin in */}
        {loggedIn && !error &&
          <>
            <Heading h={2} my={2}> Logged in. Redirecting to dashboard... </Heading>
          </>
        }

        {/* Errors */}
        {error &&
          <>
            <Box mb={3} p={4} bg='red1'>{error.response.status} {error.response.data.error}</Box>
            <Link href='/login'>Try logging in again</Link>
          </>
        }
      </Flex>

    </Layout>
  )
}

export default Login
