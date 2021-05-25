import React, { useCallback, useState } from 'react'
import { Box, Flex } from 'ooni-components'

import RegisterForm from '../components/RegisterForm'
import { fetcher, registerUser } from '../components/lib/api'
import { set } from 'react-hook-form'

const Register = () => {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  const onSubmit = useCallback((data) => {
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

  return (
    <Flex alignItems='center' fontSize={3} my={5} flexDirection='column'>
      {submitted ? (
        <Box>
          Thank you registering. Please check your email for a link to activate and log in to your account.
        </Box>
      ) : (
        <Box>
          <RegisterForm onSubmit={onSubmit} submitting={submitting} />
        </Box>
      )}
      {error && 
        <Box color='red'>
          {error}
        </Box>
      }
    </Flex>
  )
}

export default Register