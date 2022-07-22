import React, { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Heading, Text, Link } from 'ooni-components'
import { useRouter } from 'next/router'
import NLink from 'next/link'

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

  const { user, loading } = useUser()

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (!loading && user.loggedIn) {
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
        <Heading h={1} mt={3} mb={1} fontSize={[3, 5]}>Test lists submission system</Heading>
        <Heading h={3} mt={1} fontWeight={300} fontSize={[2, 3]}>Contribute websites for censorship testing</Heading>
        <Text fontSize={1} mt={4} textAlign='center'>Add your email address and click the link sent to your email to log into this platform. <br/>We do not store email addresses.</Text>
      </Flex>
      <Flex mt={4} flexDirection='column'>
        {/* Before logging In */}
        {!token && !submitted &&
          <LoginForm onLogin={onLoginSubmit} />
        }
        {!token && submitted &&
          <Heading h={3} width={[1, 2 / 3]} textAlign='center' mx='auto'>
            Your login request has been submitted. Please check your email for a link to activate and log in to your account.
          </Heading>
        }

        {/* While logging In */}
        {token && !loggedIn && !error &&
          <>
            <Loading size={96} dir={-1} speed={2} />
            <Heading h={2} my={2} mx='auto'> Logging in... </Heading>
          </>
        }

        {/* After loggin in */}
        {loggedIn && !error &&
          <>
            <Heading h={2} my={2} mx='auto'> Logged in. Redirecting to dashboard... </Heading>
          </>
        }

        {/* Errors */}
        {error &&
          <Box width={[1, 1 / 3]} mx='auto' textAlign={'center'}>
            <Box mb={3} p={4} bg='red1'>{error}</Box>
            <NLink href='/login'>Try logging in again</NLink>
          </Box>
        }
      </Flex>
      <Flex alignItems='center' flexDirection='column'>
        <Box bg='blue5' mt={5} color='white' px={4} py={4} maxWidth="860px">
          <Text fontSize={[1, 2]}>
            To discover the blocking of websites around the world, tools like <NLink href="https://ooni.org/install" passHref={true}><Link color="white" css={{ textDecoration: 'underline' }}>OONI Probe</Link></NLink> rely on certain lists of websites (&quot;<NLink href="https://ooni.org/get-involved/contribute-test-lists" passHref={true}><Link color="white" css={{ textDecoration: 'underline' }}>test lists</Link></NLink>&quot;). This platform includes these lists, which you can review and contribute to.<br/>
            Help the internet freedom community discover website blocks around the world by contributing websites for testing!
          </Text>
        </Box>
      </Flex>
    </Layout>
  )
}

export default Login
