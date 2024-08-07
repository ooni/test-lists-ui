import { Box, Button, Flex, Input } from 'ooni-components'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { useIntl } from 'react-intl'
import { registerUser } from './lib/api'
import Loading from './Loading'

const StyledError = styled.small`
  color: ${(props) => props.theme.colors.red5};
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

export const LoginForm = ({ onLogin }) => {
  const PRODUCTION_URL = 'https://test-lists.ooni.org/'
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState(null)
  const { formatMessage } = useIntl()

  const { handleSubmit, control, formState, reset } = useForm({
    mode: 'onTouched',
    defaultValues: { email_address: '' },
  })

  const { errors, isValid, isDirty } = formState

  const onSubmit = useCallback(
    (data) => {
      const { email_address } = data
      const redirectTo =
        process.env.NODE_ENV === 'development'
          ? PRODUCTION_URL
          : window.location.origin
      const registerApi = async (email_address) => {
        try {
          await registerUser(email_address, redirectTo)
          if (typeof onLogin === 'function') {
            onLogin()
          }
        } catch (e) {
          setError(e.message)
          // Reset form to mark `isDirty` as false
          reset({}, { keepValues: true })
        } finally {
          setSubmitting(false)
        }
      }
      setSubmitting(true)
      registerApi(email_address)
    },
    [onLogin, reset],
  )

  useEffect(() => {
    // Remove previous errors when form becomes dirty again
    if (isDirty) {
      setError(null)
    }
  }, [isDirty])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection={['column']} alignItems={'center'}>
        <StyledInputContainer>
          <Controller
            render={({ field }) => (
              <Input
                placeholder='Email *'
                error={errors?.email_address?.message}
                {...field}
              />
            )}
            rules={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              },
              required: true,
            }}
            name='email_address'
            control={control}
          />
        </StyledInputContainer>
        <Box my={2}>
          {/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
          <StyledError>{loginError ?? <>&nbsp;</>}</StyledError>
        </Box>
        <Box my={2}>
          <Button type='submit' disabled={submitting || !isDirty || !isValid}>
            {formatMessage({ id: 'LoginForm.Login' })}
          </Button>
        </Box>
        {submitting ? <Loading size={96} /> : <Box my={50} />}
      </Flex>
    </form>
  )
}

export default LoginForm
