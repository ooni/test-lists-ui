import React, { useCallback } from 'react'

import RegisterForm from '../components/RegisterForm'
import { fetcher } from '../components/lib/api'

const Register = () => {
  
  const onSubmit = useCallback((data) => {
    const { email_address, nickname } = data

    const registerUser = async (email_address, nickname) => {
      const res = await fetcher(`/api/v1/user_register`, {
        method: 'POST',
        body: JSON.stringify({
          email_address,
          nickname
        })
      })
  
      console.log(res)
    }
    registerUser(email_address, nickname)
  })

  return (
    <RegisterForm onSubmit={onSubmit} />
  )
}

export default Register