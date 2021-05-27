import Axios from 'axios'

export const apiEndpoints = {
  ACCOUNT_METADATA: '/api/_/account_metadata',
  USER_REGISTER: '/api/v1/user_register',
  USER_LOGIN: '/api/v1/user_login',
  RULE_LIST: '/api/_/url-priorities/list',
  RULE_UPDATE: '/api/_/url-priorities/update',
  COUNTRIES_LIST: '/api/_/countries',
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
  withCredentials: true
});

export const fetcher = async (url) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (e) {
    const error = new Error(e.response?.data?.error ?? e.message)
    error.info = e.response.statusText
    error.status = e.response.status
    throw error
  } 
}

export const fetchUser = () => {
  return axios.get(apiEndpoints.ACCOUNT_METADATA).then(res => res.data)
}

export const registerUser = (email, nickname) => {
  return axios.post(apiEndpoints.USER_REGISTER, {
    email_address: email,
    nickname: nickname
  }).then(res => res.data)
}

export const loginUser = (token) => {
  return axios.get(apiEndpoints.USER_LOGIN, {
    params: {
      k: token
    }
  }).then(res => res.data)
}

export const updateRule = (oldEntry, newEntry) => {
  return axios.post(apiEndpoints.RULE_UPDATE, {
    old_entry: oldEntry,
    new_entry: newEntry
  })
  .then(res => res.data)
}

export const deleteRule = (oldEntry) => updateRule(oldEntry, null)