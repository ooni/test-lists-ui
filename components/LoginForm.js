import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Flex, Box, Button, Text } from 'ooni-components'

const LoginForm = ({
  onSubmit,
  submitting,
}) => {
  const { handleSubmit, register, formState: { errors } } = useForm()
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        flexDirection={['column']}
        alignItems={'center'}
        justifyContent='center'
      >
        <Box my={2}>
          <input type='email' placeholder='Email' {...register('email_address', { required: true })} />
        </Box>
        <Box my={2}>
          <input type='text' placeholder='Nickname' {...register('nickname', { required: true, maxLength: 16})} />
        </Box>
        <Box my={2}>
          <button type='submit' disabled={submitting}> Login </button>
        </Box>
        <Box my={2} color='red5' as='small'>
          {errors?.email_address && <Text> Email: {errors?.email_address?.type} </Text>}
          {errors?.nickname && <Text> Nickname: {errors?.nickname?.type} </Text>}
        </Box>
      </Flex>
    </form>
  )
}

export default LoginForm
