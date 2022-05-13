import Axios, { AxiosRequestConfig } from 'axios'
import { SWRConfiguration } from 'swr'
import { IApiError, Entry, ListURL, PriorityRuleEntry } from '../types'

export const apiEndpoints = {
  ACCOUNT_METADATA: '/api/_/account_metadata',
  USER_REGISTER: '/api/v1/user_register',
  USER_LOGIN: '/api/v1/user_login',
  USER_LOGOUT: '/api/v1/user_logout',
  RULE_LIST: '/api/_/url-priorities/list',
  RULE_UPDATE: '/api/_/url-priorities/update',
  COUNTRIES_LIST: '/api/_/countries',
  // Submissions
  SUBMISSION_LIST: '/api/v1/url-submission/test-list',
  SUBMISSION_ADD: '/api/v1/url-submission/add-url',
  SUBMISSION_UPDATE: '/api/v1/url-submission/update-url',
  SUBMISSION_STATE: '/api/v1/url-submission/state',
  SUBMISSION_DIFF: '/api/v1/url-submission/diff',
  SUBMISSION_SUBMIT: '/api/v1/url-submission/submit'
}

export enum eApiEndpoints {
  ACCOUNT_METADATA = '/api/_/account_metadata',
  USER_REGISTER= '/api/v1/user_register',
  USER_LOGIN = '/api/v1/user_login',
  USER_LOGOUT = '/api/v1/user_logout',
  RULE_LIST = '/api/_/url-priorities/list',
  RULE_UPDATE = '/api/_/url-priorities/update',
  COUNTRIES_LIST = '/api/_/countries',
  // Submissions
  SUBMISSION_LIST = '/api/v1/url-submission/test-list',
  SUBMISSION_ADD = '/api/v1/url-submission/add-url',
  SUBMISSION_UPDATE = '/api/v1/url-submission/update-url',
  SUBMISSION_STATE = '/api/v1/url-submission/state',
  SUBMISSION_DIFF = '/api/v1/url-submission/diff',
  SUBMISSION_SUBMIT = '/api/v1/url-submission/submit'
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
  withCredentials: true
})

interface IFetcherError extends Error {
  info?: string
  status?: string
}

export const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url)
    return res.data.rules ?? res.data
  } catch (e) {
    let error: IFetcherError
    if (Axios.isAxiosError(e) && e.response) {
      error = new Error(e.response?.data?.error)
      error.info = e.response.statusText
      error.status = String(e.response.status)
    } else {
      error = new Error((e as Error).message)
      error.info = ''
      error.status = ''
    }
    throw error
  }
}

export const fetchTestList = async (url: string, cc: string) => {
  try {
    const res = await axios.get<ListURL[]>(`${url}/${cc}`)
    return res.data
  } catch (e) {
    let error: IFetcherError
    if (Axios.isAxiosError(e) && e.response) {
      error = new Error(e.response?.data?.error)
      error.info = e.response.statusText
      error.status = String(e.response.status)
    } else {
      error = new Error((e as Error).message)
      error.info = ''
      error.status = ''
    }
    throw error
  }
}

export const getAPI = async (endpoint: eApiEndpoints, params: any = {}, config: AxiosRequestConfig = {}) => {
  return await axios.request({
    method: config.method ?? 'GET',
    url: endpoint,
    params: params,
    ...config
  })
    .then(res => res.data)
    .catch(e => {
      const error = new Error(e?.response?.data?.error ?? e.message) as IApiError
      error.info = e?.response?.statusText
      error.status = e?.response?.status
      throw error
    })
}

const postAPI = async (endpoint: eApiEndpoints, params?: any, config?: AxiosRequestConfig) => {
  return await getAPI(endpoint, {}, { ...config, method: 'POST', data: params })
}

export const registerUser = async (email: string, nickname: string) => {
  console.debug('Called registerUser with', email, nickname)
  const data = await postAPI(eApiEndpoints.USER_REGISTER, {
    email_address: email,
    nickname: nickname
  })
  return data
}

export const loginUser = async (token: string) => {
  return await getAPI(eApiEndpoints.USER_LOGIN, { k: token })
}

export const logoutUser = async () => {
  return await getAPI(eApiEndpoints.ACCOUNT_METADATA)
}

export const updateRule = (oldEntry: PriorityRuleEntry, newEntry: PriorityRuleEntry | {}) => {
  console.debug('Called updateRule with old_entry', oldEntry, 'new_entry', newEntry)
  return axios.post(eApiEndpoints.RULE_UPDATE, {
    old_entry: oldEntry,
    new_entry: newEntry
  })
    .then(res => res.data)
}

export const deleteRule = (oldEntry: PriorityRuleEntry) => {
  console.debug('Called deleteRule with old_entry', oldEntry)
  return updateRule(oldEntry, {})
}

export const addURL = async (newEntry: Entry, cc: string, comment: string) => {
  console.debug('Called addURL with new_entry', newEntry)
  const data = await postAPI(eApiEndpoints.SUBMISSION_UPDATE, {
    country_code: cc,
    comment: comment,
    new_entry: newEntry,
    old_entry: {}
  })
  return data.updated_entry
}

export const updateURL = async (cc: string, comment: string, oldEntry: Entry, newEntry: Entry) => {
  console.debug('Called updateURL with old_entry', oldEntry, 'new_entry', newEntry)
  const data = await postAPI(eApiEndpoints.SUBMISSION_UPDATE, {
    country_code: cc,
    comment: comment,
    old_entry: oldEntry,
    new_entry: newEntry
  })
  return data.updated_entry
}

export const deleteURL = async (cc: string, comment: string, oldEntry: Entry) => {
  console.debug('Called deleteURL with oldEntry', oldEntry)
  const data = await postAPI(eApiEndpoints.SUBMISSION_UPDATE, {
    country_code: cc,
    comment: comment,
    old_entry: oldEntry,
    new_entry: {}
  })
  return data.updated_entry
}

export const submitChanges = async () => {
  console.debug('Called submitChanges')
  const data = await postAPI(eApiEndpoints.SUBMISSION_SUBMIT)
  return data.pr_id
}

export const customErrorRetry: SWRConfiguration['onErrorRetry'] = (error, key, config, revalidate, opts) => {
  // This overrides the default exponential backoff algorithm
  // Instead it uses the `errorRetryInterval` and `errorRetryCount` configuration to
  // limit the retries
  const maxRetryCount = config.errorRetryCount
  if (maxRetryCount !== undefined && opts.retryCount > maxRetryCount) return

  // Never retry on 4xx errors
  if (Math.floor(error.status / 100) === 4) return

  setTimeout(revalidate, config.errorRetryInterval, opts)
}
