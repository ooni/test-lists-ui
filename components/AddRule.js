import React, { useCallback, useRef, useState } from 'react'
import { Flex, Box, Input, Button } from 'ooni-components'
import { useRouter } from 'next/router'

import { updateRule } from '../components/lib/api'

const fields = [
  {
    name: 'category_code',
    type: 'text'
  },
  {
    name: 'cc',
    type: 'text'
  },
  {
    name: 'domain',
    type: 'text'
  },
  {
    name: 'url',
    type: 'text'
  },
  {
    name: 'priority',
    type: 'number'
  }
]

const AddRule = () => {
  const formRef = useRef()
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = useCallback((e) => {
    const formData = new FormData(e.target)
    const newEntry = {}
    e.preventDefault()
    for (const [key, value] of formData.entries()) {
      newEntry[key] = key === 'priority' ? Number(value) : value
    }
    updateRule({}, newEntry).then(() => {
      // formRef.current.reset() // disabled because temporarily we reload page on success anyway
      // mutate(apiEndpoints.RULE_LIST, true)
      router.reload()
    }).catch(e => {
      // TODO: Show this error somewhere. maybe where the action was performed
      setError(`addRule failed: ${e.response.data.error}`)
    })
  }, [router])

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <Flex alignItems='center' justifyContent='space-between' my={2}>
        {fields.map((field, index) => (
          <Input key={index} {...field} placeholder={field.name} />
        ))}
        <Button mx={3} p={3} type='submit'> Add Rule </Button>
      </Flex>
      <Box as='small' color='red6'> {error || 'Note: Page may reload if add/update/delete operations behave unexpectedly.'} </Box>
    </form>
  )
}

export default AddRule
