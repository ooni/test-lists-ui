import { useRouter } from 'next/router'
import { Input } from 'ooni-components'
import React, { useCallback, useRef, useState } from 'react'

import { updateRule } from '../components/lib/api'

const fields = [
  {
    name: 'category_code',
    type: 'text',
  },
  {
    name: 'cc',
    type: 'text',
  },
  {
    name: 'domain',
    type: 'text',
  },
  {
    name: 'url',
    type: 'text',
  },
  {
    name: 'priority',
    type: 'number',
  },
]

const AddRule = () => {
  const formRef = useRef()
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = useCallback(
    (e) => {
      const formData = new FormData(e.target)
      const newEntry = {}
      e.preventDefault()
      for (const [key, value] of formData.entries()) {
        newEntry[key] = key === 'priority' ? Number(value) : value
      }
      updateRule({}, newEntry)
        .then(() => {
          // formRef.current.reset() // disabled because temporarily we reload page on success anyway
          // mutate(apiEndpoints.RULE_LIST, true)
          router.reload()
        })
        .catch((e) => {
          // TODO: Show this error somewhere. maybe where the action was performed
          setError(`addRule failed: ${e?.response?.data?.error}`)
        })
    },
    [router],
  )

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="my-2 flex items-center justify-between">
        {fields.map((field) => (
          <Input key={field.name} {...field} placeholder={field.name} />
        ))}
        <button className="btn btn-primary mx-4 p-4" type='submit'>
          Add Rule
        </button>
      </div>
      <small className="text-red-600">
        {error ||
          'Note: Page may reload if add/update/delete operations behave unexpectedly.'}
      </small>
    </form>
  )
}

export default AddRule
