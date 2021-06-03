import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, Label, Modal } from 'ooni-components'
import { Container } from 'ooni-components/dist/components'

import { apiEndpoints, updateURL } from '../lib/api'
import CategoryList from './CategoryList'
import categories from '../lib/category_codes.json'
import { mutate } from 'swr'

export const EditModal = ({ open, cc, data, onSuccess, ...rest }) => {
  return (
    <Modal show={open} {...rest}>
      <EditForm onSuccess={onSuccess} oldEntry={data} cc={cc} />
    </Modal>
  )
}

const fields = [
  {
    name: 'url',
    type: 'text',
  },
  {
    name: 'notes',
    type: 'text',
  },
  {
    name: 'comment',
    type: 'text',
  }
]

export const EditForm = ({ cc, oldEntry, onSuccess }) => {
  const formRef = useRef()
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = useCallback((e) => {
    
    e.preventDefault()
    const formData = new FormData(e.target)
    const today = new Date().toLocaleDateString()
    const categoryCode = formData.get('category_code')
    const categoryDesc = categories[categoryCode]

    // form data to obj, in case we change [] to {} for newEntry
    // const newEntryObj = Object.fromEntries(formData)
    const keys = ['url', 'category_code', 'category_description', 'date_added', 'source', 'notes']
    const oldEntryValues = keys.map(k => oldEntry[k])

    const newEntry = [
      formData.get('url'),
      categoryCode,
      categoryDesc,
      oldEntry.date_added,
      oldEntry.source,
      formData.get('notes')
    ]

    const comment = formData.get('comment')

    updateURL(cc, comment, oldEntryValues, newEntry).then(async () => {
      await mutate([apiEndpoints.SUBMISSION_LIST, cc])
      onSuccess()
    }).catch(e => {
      // TODO: Show this error somewhere. maybe where the action was performed
      setError(`addRule failed: ${e.response.data.error}`)
    })
  })

  return (
    <Container>
      <form onSubmit={handleSubmit} ref={formRef}>
        <Flex flexDirection='column' alignItems='center' justifyContent='space-between' my={2}>

          <Label my={1} htmlFor='category_code'>Category</Label>
          <CategoryList name='category_code' defaultValue={oldEntry.category_code} />

          {fields.map((field, index) => (
            <Flex flexDirection='column' my={2} key={index}>
              <Label my={1} htmlFor={field.name}>{field.name}</Label>
              <input {...field} placeholder={field.name} defaultValue={oldEntry[field.name]} />
            </Flex>
          ))}
          <button mx={3} p={3} type='submit'> Update URL </button>
        </Flex>
        <Box as='small' color='red6'> {error} </Box>
      </form>
    </Container>
  )
}