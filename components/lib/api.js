import Axios from 'axios'

export const apiEndpoints = {
  ACCOUNT_METADATA: '/api/_/account_metadata',
  USER_REGISTER: '/api/v1/user_register',
  USER_LOGIN: '/api/v1/user_login',
  RULE_LIST: '/api/_/url-priorities/list',
  RULE_UPDATE: '/api/_/url-priorities/update',
  COUNTRIES_LIST: '/api/_/countries',
  // Submissions
  SUBMISSION_LIST: '/api/v1/url-submission/test-list',
  SUBMISSION_ADD: '/api/v1/url-submission/add-url',
  SUBMISSION_UPDATE: '/api/v1/url-submission/update-url',
  SUBMISSION_STATE: '/api/v1/url-submission/state'
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
  withCredentials: true
})

export const fetcher = async (url) => {
  try {
    const res = await axios.get(url)
    return res.data.rules ?? res.data
  } catch (e) {
    const error = new Error(e.response?.data?.error ?? e.message)
    error.info = e.response.statusText
    error.status = e.response.status
    throw error
  }
}

export const fetchTestList = async (url, cc) => {
  try {
    const res = await axios.get(`${url}/${cc}`)
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
  console.debug('Called updateRule with old_entry', oldEntry, 'new_entry', newEntry)
  return axios.post(apiEndpoints.RULE_UPDATE, {
    old_entry: oldEntry,
    new_entry: newEntry
  })
    .then(res => res.data)
}

export const deleteRule = (oldEntry) => {
  console.debug('Called deleteRule with old_entry', oldEntry)
  return updateRule(oldEntry, {})
}

export const addURL = (newEntry, cc, notes) => {
  console.debug('Called SUBMISSION_ADD with new_entry', newEntry)
  return axios.post(apiEndpoints.SUBMISSION_ADD, {
    country_code: cc,
    new_entry: newEntry,
    comment: notes
  })
    .then(res => res.data)
}

export const updateURL = (cc, comment, oldEntry, newEntry) => {
  console.debug('Called updateURL with old_entry', oldEntry, 'new_entry', newEntry)
  return axios.post(apiEndpoints.SUBMISSION_UPDATE, {
    country_code: cc,
    comment: comment,
    old_entry: oldEntry,
    new_entry: newEntry
  })
    .then(res => res.data.updated_entry)
}
