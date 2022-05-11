import { AxiosError } from 'axios'
import { SWRResponse } from 'swr'

export interface IApiError extends AxiosError {
  info?: string
  status?: string
}

export type ListURL = {
  category_code: string
  date_added: string
  notes: string
  source: string
  url: string
}

export type Entry = {
  category_code: string
  date_added: string
  notes: string
  url: string
  source: string
}

export type UpdateURLPayload = {
  comment: string
  country_code: string
  new_entry: Entry,
  old_entry: Entry
}

export type PriorityRuleEntry = {
  category_code: string
  cc: string
  domain: string
  priority: number
  url: string
}

export enum SubmissiontState {
  CLEAN = 'CLEAN',
  IN_PROGRESS = 'IN_PROGRESS',
  PR_OPEN = 'PR_OPEN',
}

export type SubmissionContextType = {
  submissionState: SubmissiontState,
  linkToPR: string,
  mutate: SWRResponse<any, Error>['mutate']
}

type FormProps = {
  onCancel?: Function,
  layout?: 'row' | 'column'
  error: string | null
  oldEntry: Entry
}

export type EditFormProps = FormProps & {
  onSubmit: Function
}

export type DeleteFormProps = FormProps & {
  onDelete: Function
}
