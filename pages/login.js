import NLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import { useIntl } from 'react-intl'
import { mutate } from 'swr'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import LoginForm from '../components/LoginForm'
import { apiEndpoints, loginUser } from '../components/lib/api'
import { useUser } from '../components/lib/hooks'

const Login = () => {
  const { formatMessage } = useIntl()
  const [submitted, setSubmitted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { token, returnTo = '/' } = router.query

  const { user, loading } = useUser()

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (!loading && user?.logged_in) {
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
      <div className="flex flex-col items-center">
        <h1 className="mb-1 mt-4 text-base md:text-xl">
          {formatMessage({ id: 'Index.Title' })}
        </h1>
        <h3 className="mt-1 text-sm font-light md:text-base">
          {formatMessage({ id: 'Index.Subtitle' })}
        </h3>
      </div>
      <div className="mt-8 flex flex-col">
        {!token && !submitted && (
          <>
            <p className="mb-2 whitespace-pre-line text-center text-xs leading-none">
              {formatMessage({ id: 'Login.Instructions' })}
            </p>
            <LoginForm onLogin={onLoginSubmit} />
          </>
        )}
        {!token && submitted && (
          <h3 className="mx-auto w-full text-center md:w-2/3">
            {formatMessage({ id: 'Login.Submitted' })}
          </h3>
        )}

        {token && !loggedIn && !error && (
          <>
            <Loading size={96} dir={-1} speed={2} />
            <h2 className="mx-auto my-2">
              {formatMessage({ id: 'Login.LoggingIn' })}
            </h2>
          </>
        )}

        {loggedIn && !error && (
          <h2 className="mx-auto my-2">
            {formatMessage({ id: 'Login.LoggedIn' })}
          </h2>
        )}

        {error && (
          <div className="mx-auto w-full text-center md:w-1/3">
            <div className="mb-4 bg-red-100 p-8">{error}</div>
            <NLink href='/login'>
              {formatMessage({ id: 'Login.TryAgain' })}
            </NLink>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="mt-8 max-w-[860px] bg-blue-500 px-8 py-8 text-white [&_a]:text-white">
          <p className="whitespace-pre-line text-xs leading-snug md:text-sm">
            {formatMessage(
              { id: 'Login.CTA' },
              {
                'probe-link': (string) => (
                  <NLink href='https://ooni.org/install'>{string}</NLink>
                ),
                'testlists-link': (string) => (
                  <NLink href='https://ooni.org/get-involved/contribute-test-lists'>
                    {string}
                  </NLink>
                ),
              },
            )}
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Login
