import { useCallback } from 'react'
import { Box, Button, Flex, Heading, Label as LLabel } from 'ooni-components'
import { Input } from 'ooni-components/dist/components'

import CategoryList from './CategoryList'
import categories from '../lib/category_codes.json'

const fields = [
  {
    name: 'url',
    type: 'text',
    label: 'URL',
    required: true
  },
  {
    name: 'notes',
    type: 'textarea',
    rows: 2,
    label: 'Notes',
    required: true
  },
  {
    name: 'comment',
    type: 'text',
    label: 'Reason for edit',
    required: true
  }
]

const Label = ({ children }) => <LLabel fontWeight='bold' my={2} fontSize={1}>{children}</LLabel>

export const EditForm = ({ oldEntry, error, onSubmit, onCancel, layout = 'column' }) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const categoryCode = formData.get('category_code')
    const categoryDesc = categories[categoryCode]
    const today = new Date().toISOString().split('T')[0]

    const keys = ['url', 'category_code', 'category_description', 'date_added', 'source', 'notes']
    const newEntryObj = {
      url: formData.get('url'),
      category_code: categoryCode,
      category_description: categoryDesc,
      date_added: oldEntry.date_added ?? today,
      source: oldEntry.source ?? '',
      notes: formData.get('notes')
    }
    const newEntry = keys.map(k => newEntryObj[k])

    const comment = formData.get('comment')

    onSubmit(newEntry, comment)
  }, [oldEntry.date_added, oldEntry.source, onSubmit])

  const width = layout === 'row' ? (1 / 4) : 1

  return (
    <form onSubmit={handleSubmit}>
      <Heading h={4}>{oldEntry.url ? `Editing ${oldEntry.url}` : 'Add new URL'}</Heading>
      <Flex flexDirection={layout} my={2} mx={2}>

        <Flex flexDirection='column' my={2} width={width}>
          <Label htmlFor='category_code'>Category</Label>
          <CategoryList name='category_code' defaultValue={oldEntry.category_code} required/>
        </Flex>

        {fields.map((field, index) => (
          <Flex flexDirection='column' my={2} key={index} width={width} px={3}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input {...field} placeholder={field.name} defaultValue={oldEntry[field.name]} />
          </Flex>
        ))}
      </Flex>

        <Flex justifyContent='space-between' width={1} my={3}>
          <Button hollow onClick={onCancel}> Cancel </Button>
          <Button type='submit'> Save </Button>
        </Flex>
      <Box as='small' color='red6'> {error} </Box>
    </form>
  )
}
