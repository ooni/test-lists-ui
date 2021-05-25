import Axios from 'axios'

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
  withCredentials: true
});

const baseFetchConfig = {
  credentials: 'include'
}

export const fetcherex = (url, ...args) =>
  fetch(`${process.env.NEXT_PUBLIC_OONI_API}${url}`, ...args).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
      console.log(res)
      throw new Error(`Request Failed: ${res.statusText}`)
    }
  })

export const fetcher = (url) => {
  return axios.get(url).then(res => res.data)
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