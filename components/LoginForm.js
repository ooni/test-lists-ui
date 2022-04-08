import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Flex, Box, Input, Button, Modal } from 'ooni-components'
import styled from 'styled-components'

import { registerUser } from './lib/api'
import Loading from './Loading'

const StyledError = styled.small`
  color: ${props => props.theme.colors.red5};
`

const StyledInputContainer = styled(Box).attrs({
  width: [1, 1 / 3],
  my: 3,
})`
  position: relative;
  & ${StyledError} {
    position: absolute;
    top: 2px;
    right: 10px;
  }
`

export const LoginModal = ({ isShowing, hide, onLogin }) =>
  <Modal show={isShowing} onHideClick={hide}>
    <LoginForm onLogin={onLogin} />
  </Modal>

export const LoginForm = ({ onLogin }) => {
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState(null)

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'onTouched',
  })

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
      >
        <StyledInputContainer>
          <Input type='email' placeholder='Email *'
            {...register('email_address', {
              required: {
                value: true,
                message: 'Email address is required'
              },
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'Invalid email address format'
              }
            })}
          />
          <StyledError>{errors?.email_address?.message}</StyledError>
        </StyledInputContainer>
        <StyledInputContainer>
          <Input type='text' placeholder='Nickname *' {...register('nickname', {
            required: {
              value: true,
              message: 'Nickname is required'
            },
            minLength: {
              value: 2,
              message: 'Should be 2 to 50 characters long'
            },
            maxLength: {
              value: 50,
              message: 'Should be 2 to 50 characters long'
            },
            pattern: {
              value: /[A-Za-z0-9]+/,
              message: 'Use letters or numbers, no symbols or spaces'
            }
          })}
          />
          <StyledError>{errors?.nickname?.message}</StyledError>
        </StyledInputContainer>
        <Box my={2}>
          <StyledError>{loginError ?? <>&nbsp;</>}</StyledError>
        </Box>
        <Box my={2}>
          <Button type='submit' disabled={submitting}> Login </Button>
        </Box>
        {submitting && <Loading size={96} />}
      </Flex>
    </form>
  )
}

export default LoginForm
