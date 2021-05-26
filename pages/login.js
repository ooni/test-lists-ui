import React, { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Heading, Text } from 'ooni-components'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Layout from '../components/Layout'
import LoginForm from '../components/LoginForm'
import { loginUser, registerUser } from '../components/lib/api'

const Login = () => {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { token, returnTo = '/' } = router.query

  // If there is a `token` URL param, call the login API
  // This fetches and sets the authentication cookie
  useEffect(() => {
    if (token) {
      const login = async (token) => {
        try {
          const res = await loginUser(token)
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
  }, [token])

  const onLogin = useCallback((data) => {
    const { email_address, nickname } = data
    setSubmitting(true)
    const registerApi = async (email_address, nickname) => {
      try {
        const res = await registerUser(email_address, nickname)
        setSubmitted(true)
      } catch (e) {
        console.log(e)
        setError(e.message)
      } finally {
        setSubmitting(false)
      }
    }
    registerApi(email_address, nickname)
  })

  const afterLogin = useCallback(() => {
    setTimeout(() => {
      router.push(returnTo)
    }, 3000)
  })

  return (
    <Layout title='Login'>
      <Flex my={6} justifyContent='center' alignItems='center' flexDirection='column'>
        {!token && !submitted &&
          <LoginForm onSubmit={onLogin} submitting={submitting} />
        }
        {!token && submitted &&
          <Box>
            Your login request has been submitted. Please check your email for a link to activate and log in to your account.
          </Box>
        }
        {token && !loggedIn && !error &&
          <>
            <Heading h={2} my={2}> Logging in... </Heading>
            <Box as='i'> with token <Text as='span' color='#0b88ec'>{token} </Text></Box>
          </>
        }
        {loggedIn && !error &&
          <>
            <Heading h={2} my={2}> Logged in. Redicting to dashboard... </Heading>
          </>
        }
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