import React, { useCallback, useEffect, useState } from 'react'
import { Box, Container, Flex, Heading, Text } from 'ooni-components'
import { useRouter } from 'next/router'

import { loginUser } from '../components/lib/api'

const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { token } = router.query

  useEffect(() => {
    if (token) {
      const login = async (token) => {
        try {
          const res = await loginUser(token)
          setLoggedIn(true)
          afterLogin()
        } catch (e) {
          console.log(e)
          setError(e)
        }
      }
      login(token)
    }
  }, [token])

  const afterLogin = useCallback(() => {
    setTimeout(() => {
      router.push('/')
    }, 5000)
  })

  return (
    <Container>
      <Flex my={6} justifyContent='center' alignItems='center' flexDirection='column'>
        {!loggedIn && !error &&
          <>
            <Heading h={2} my={2}> Logging in... </Heading>
            <Box as='i'> with token <Text as='span' color='#0b88ec'>{token} </Text></Box>
          </>
        }
        {loggedIn && !error &&
          <>
            <Heading h={2} my={2}> Logged in. Redicting to dashboard in 5 seconds. </Heading>
          </>
        }
        {error && 
          <>
            <Heading h={2} my={2}> Login failed: {error.toString()} </Heading>
          </>
        }
      </Flex>

    </Container>
  )
}

export default Login