import { Input } from 'ooni-components'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useIntl } from 'react-intl'
import { registerUser } from './lib/api'
import Loading from './Loading'

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
    if (isDirty) {
      setError(null)
    }
  }, [isDirty])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        <div className="login-input-container">
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
        </div>
        <div className="my-2">
          {/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
          <small className="login-error text-red-500">
            {loginError ?? <>&nbsp;</>}
          </small>
        </div>
        <div className="my-2">
          <button
            className="btn btn-primary"
            type='submit'
            disabled={submitting || !isDirty || !isValid}
          >
            {formatMessage({ id: 'LoginForm.Login' })}
          </button>
        </div>
        {submitting ? <Loading size={96} /> : <div className="my-[50px]" />}
      </div>
    </form>
  )
}

export default LoginForm
