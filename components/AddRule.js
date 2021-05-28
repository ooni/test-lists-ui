import React, { useCallback, useRef } from 'react'
import { Flex, Box, Input, Button } from 'ooni-components'

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

const AddRule = ({ onAddRule }) => {
  const formRef = useRef()
  const handleSubmit = useCallback((e) => {
    const formData = new FormData(e.target)
    const newEntry = {}
    e.preventDefault()
    for (let [key, value] of formData.entries()) {

      newEntry[key] = key === 'priority' ? Number(value) : value
    }
    onAddRule(newEntry)
    // TODO: This should be conditional. API errors should be transmitted back
    // formRef.current.reset() // disabled because temporarily we reload page on success anyway
  })

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <Flex alignItems='center' justifyContent='space-between' my={2}>
        {fields.map((field, index) => (
          <Input key={index} {...field} placeholder={field.name} />
        ))}
        <Button mx={3} p={3} type='submit'> Add Rule </Button>
      </Flex>
    </form>
  )
}

export default AddRule