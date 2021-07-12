import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Flex, Box, Input, Button, Text, Modal } from 'ooni-components'

import { registerUser } from './lib/api'
import Loading from './Loading'

export const LoginModal = ({ isShowing, hide, onLogin }) =>
  <Modal show={isShowing} onHideClick={hide}>
    <LoginForm onLogin={onLogin} />
  </Modal>

export const LoginForm = ({ onLogin }) => {
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState(null)
  const { handleSubmit, register, formState: { errors } } = useForm()

  const onSubmit = useCallback((data) => {
    const { email_address, nickname } = data
    const registerApi = async (email_address, nickname) => {
      try {
        await registerUser(email_address, nickname)
        if (typeof onLogin === 'function') {
          onLogin()
        }
      } catch (e) {
        console.error(e)
        setError(e.message)
      } finally {
        setSubmitting(false)
      }
    }
    setSubmitting(true)
    registerApi(email_address, nickname)
  }, [onLogin])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        flexDirection={['column']}
        alignItems={'center'}
        justifyContent='center'
      >
        <Box my={2}>
          <Input type='email' placeholder='Email' {...register('email_address', { required: true })} />
        </Box>
        <Box my={2}>
          <Input type='text' placeholder='Nickname' {...register('nickname', { required: true, maxLength: 16 })} />
        </Box>
        <Box my={2}>
          <Button type='submit' disabled={submitting}> Login </Button>
        </Box>
        <Box my={2} color='red5' as='small'>
          {errors?.email_address && <Text> Email: {errors?.email_address?.type} </Text>}
          {errors?.nickname && <Text> Nickname: {errors?.nickname?.type} </Text>}
          {loginError && <Text>Login Error: {loginError}</Text>}
        </Box>
        {submitting && <Loading size={96} />}
      </Flex>
    </form>
  )
}

export default LoginForm
