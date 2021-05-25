import React from 'react'

import { Controller, useForm } from 'react-hook-form'
import { Flex, Box, Input, Button, Text, Modal } from 'ooni-components'

export const LoginModal = ({ isShowing, hide }) => 
  <Modal show={isShowing} onHideClick={hide}>
    <LoginForm />
  </Modal>


export const LoginForm = ({
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
          <Input type='email' placeholder='Email' {...register('email_address', { required: true })} />
        </Box>
        <Box my={2}>
          <Input type='text' placeholder='Nickname' {...register('nickname', { required: true, maxLength: 16})} />
        </Box>
        <Box my={2}>
          <Button type='submit' disabled={submitting}> Login </Button>
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
