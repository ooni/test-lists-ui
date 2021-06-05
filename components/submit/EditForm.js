import { useCallback } from 'react'
import { Box, Flex, Heading, Label as LLabel } from 'ooni-components'
import { Container, Input } from 'ooni-components/dist/components'

import CategoryList from './CategoryList'
import categories from '../lib/category_codes.json'

const fields = [
  {
    name: 'url',
    type: 'text',
    label: 'URL'
  },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Notes'
  },
  {
    name: 'comment',
    type: 'text',
    label: 'Reason for edit'
  }
]

const Label = ({ children }) => <LLabel fontWeight='bold' my={2} fontSize={1}>{children}</LLabel>

export const EditForm = ({ oldEntry, error, onSubmit, onCancel }) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const categoryCode = formData.get('category_code')
    const categoryDesc = categories[categoryCode]

    const keys = ['url', 'category_code', 'category_description', 'date_added', 'source', 'notes']
    const newEntryObj = {
      url: formData.get('url'),
      category_code: categoryCode,
      category_description: categoryDesc,
      date_added: oldEntry.date_added,
      source: oldEntry.source,
      notes: formData.get('notes')
    }
    const newEntry = keys.map(k => newEntryObj[k])

    const comment = formData.get('comment')

    onSubmit(newEntry, comment)
  }, [oldEntry.date_added, oldEntry.source, onSubmit])

  return (
    <Container sx={{ width: ['90vw', '40vw'] }} px={[2, 5]} color='gray8'>
      <form onSubmit={handleSubmit}>
        <Flex flexDirection='column' my={2} mx={2}>
          <Heading h={4}>Editing {oldEntry.url}</Heading>

          <Flex flexDirection='column' my={2}>
            <Label htmlFor='category_code'>Category</Label>
            <CategoryList name='category_code' defaultValue={oldEntry.category_code} />
          </Flex>

          {fields.map((field, index) => (
            <Flex flexDirection='column' my={2} key={index}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input {...field} placeholder={field.name} defaultValue={oldEntry[field.name]} />
            </Flex>
          ))}

          <Flex justifyContent='space-between' width={1} my={3}>
            <button onClick={onCancel}> Cancel </button>
            <button type='submit'> Save </button>
          </Flex>
        </Flex>
        <Box as='small' color='red6'> {error} </Box>
      </form>
    </Container>
  )
}
