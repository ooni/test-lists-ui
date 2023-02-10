import Axios from 'axios'

export const apiEndpoints = {
  ACCOUNT_METADATA: '/api/_/account_metadata',
  TOKEN_REFRESH: '/api/v1/user_refresh_token',
  USER_REGISTER: '/api/v1/user_register',
  USER_LOGIN: '/api/v1/user_login',
  USER_LOGOUT: '/api/v1/user_logout',
  RULE_LIST: '/api/_/url-priorities/list',
  RULE_UPDATE: '/api/_/url-priorities/update',
  COUNTRIES_LIST: '/api/_/countries',
  // Submissions
  SUBMISSION_LIST: '/api/_/url-submission/test-list',
  SUBMISSION_UPDATE: '/api/v1/url-submission/update-url',
  SUBMISSION_SUBMIT: '/api/v1/url-submission/submit'
}

const getBearerToken = () => {
  return typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('bearer'))?.token : ''
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
})

export const refreshToken = async () => {
  return axios
    .get(apiEndpoints.TOKEN_REFRESH, { headers: { Authorization: `Bearer ${getBearerToken()}` } })
    .then(({ data }) => {
      localStorage.setItem('bearer', JSON.stringify({ token: data.bearer, created_at: Date.now() }))
    })
}

export const fetcher = async (url) => {
  try {
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${getBearerToken()}` } })
    return res.data.rules ?? res.data
  } catch (e) {
    const error = new Error(e?.response?.data?.error ?? e.message)
    error.info = e?.response?.statusText
    error.status = e?.response?.status
    throw error
  }
}

export const getAPI = async (endpoint, params = {}, config = {}) => {
  return await axios.request({
    method: config.method ?? 'GET',
    url: endpoint,
    params: params,
    ...config,
    headers: { Authorization: `Bearer ${getBearerToken()}` }
  })
    .then(res => res.data)
    .catch(e => {
      const error = new Error(e?.response?.data?.error ?? e.message)
      error.info = e?.response?.statusText
      error.status = e?.response?.status
      throw error
    })
}

const postAPI = async (endpoint, params, config) => {
  return await getAPI(endpoint, null, { method: 'POST', data: params })
}

export const registerUser = async (email_address, redirect_to) => {
  console.debug('Called registerUser with', email_address)
  const data = await postAPI(apiEndpoints.USER_REGISTER, {
    email_address,
    redirect_to
  })
  return data
}

export const loginUser = async (token) => {
  return await axios.get(apiEndpoints.USER_LOGIN, { params: { k: token } })
    .then(({ data }) => {
      localStorage.setItem('bearer', JSON.stringify({ token: data?.bearer, created_at: Date.now() }))
    })
}

export const logoutUser = async (token) => {
  return await postAPI(apiEndpoints.USER_LOGOUT)
}

export const updateRule = (oldEntry, newEntry) => {
  console.debug('Called updateRule with old_entry', oldEntry, 'new_entry', newEntry)
  return postAPI(apiEndpoints.RULE_UPDATE, {
    old_entry: oldEntry,
    new_entry: newEntry
  })
    .then(res => res.data)
}

export const deleteRule = (oldEntry) => {
  console.debug('Called deleteRule with old_entry', oldEntry)
  return updateRule(oldEntry, {})
}

export const addURL = async (newEntry, cc, comment) => {
  console.debug('Called addURL with new_entry', newEntry)
  const data = await postAPI(apiEndpoints.SUBMISSION_UPDATE, {
    country_code: cc,
    comment: comment,
    new_entry: newEntry,
    old_entry: {}
  })
  return data.updated_entry
}

export const updateURL = async (cc, comment, oldEntry, newEntry) => {
  console.debug('Called updateURL with old_entry', oldEntry, 'new_entry', newEntry)
  const data = await postAPI(apiEndpoints.SUBMISSION_UPDATE, {
    country_code: cc,
    comment: comment,
    old_entry: oldEntry,
    new_entry: newEntry
  })
  return data.updated_entry
}

export const deleteURL = async (cc, comment, oldEntry) => {
  console.debug('Called deleteURL with oldEntry', oldEntry)
  const data = await postAPI(apiEndpoints.SUBMISSION_UPDATE, {
    country_code: cc,
    comment: comment,
    old_entry: oldEntry,
    new_entry: {}
  })
  return data.updated_entry
}

export const submitChanges = async () => {
  console.debug('Called submitChanges')
  const data = await postAPI(apiEndpoints.SUBMISSION_SUBMIT)
  return data.pr_id
}

export const customErrorRetry = (error, key, config, revalidate, opts) => {
  // This overrides the default exponential backoff algorithm
  // Instead it uses the `errorRetryInterval` and `errorRetryCount` configuration to
  // limit the retries
  const maxRetryCount = config.errorRetryCount
  if (maxRetryCount !== undefined && opts.retryCount > maxRetryCount) return
  // Never retry on 4xx errors
  if (Math.floor(error.status / 100) === 4) return

  setTimeout(revalidate, config.errorRetryInterval, opts)
}
