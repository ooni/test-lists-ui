import React, { useState, useCallback, useEffect } from 'react'
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
    top: -10px;
    right: 0px;
  }
`

type LoginFormData = {
  email_address: string,
  nickname: string
}

type LoginFormProps = {
  onLogin: Function
}

export const LoginForm: React.FunctionComponent<LoginFormProps> = ({ onLogin }) => {
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState<string | null>(null)
  const { handleSubmit, register, formState, reset } = useForm<LoginFormData>({
    mode: 'onTouched',
  })

  const { errors, isValid, isDirty } = formState

  const onSubmit = useCallback((data: LoginFormData) => {
    const { email_address, nickname } = data
    const registerApi = async (email_address: string, nickname: string) => {
      try {
        await registerUser(email_address, nickname)
        if (typeof onLogin === 'function') {
          onLogin()
        }
      } catch (e) {
        // Reset form to mark `isDirty` as false
        reset({}, { keepValues: true })
        console.error(e)
        if (e instanceof Error) {
          setError(e.message)
        }
      } finally {
        setSubmitting(false)
      }
    }
    setSubmitting(true)
    registerApi(email_address, nickname)
  }, [onLogin, reset])

  useEffect(() => {
    // Remove previous errors when form becomes dirty again
    if (isDirty) {
      setError(null)
    }
  }, [isDirty])

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
              value: 3,
              message: 'Should be 3 to 50 characters long'
            },
            maxLength: {
              value: 50,
              message: 'Should be 3 to 50 characters long'
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
          <Button type='submit' disabled={submitting || !isDirty || !isValid}> Login </Button>
        </Box>
        {submitting ? <Loading size={96} /> : <Box my={50}></Box>}
      </Flex>
    </form>
  )
}

type LoginModalProps = {
  isShowing: boolean,
  hide: Function,
  onLogin: Function
}
export const LoginModal: React.FunctionComponent<LoginModalProps> = ({ isShowing, hide, onLogin }) =>
  <Modal show={isShowing} onHideClick={hide}>
    <LoginForm onLogin={onLogin} />
  </Modal>

export default LoginForm
