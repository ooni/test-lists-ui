import Axios from 'axios'

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
  withCredentials: true
});

export const fetcher = async (url) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (e) {
    const error = new Error(e.response.data.error)
    error.info = e.response.statusText
    error.status = e.response.status
    throw error
  }
}

export const fetchUser = () => {
  return axios.get('/api/_/account_metadata').then(res => res.data)
}

export const registerUser = (email, nickname) => {
  return axios.post('/api/v1/user_register', {
    email_address: email,
    nickname: nickname
  }).then(res => res.data)
}

export const loginUser = (token) => {
  return axios.get('/api/v1/user_login', {
    params: {
      k: token
    }
  }).then(res => res.data)
}