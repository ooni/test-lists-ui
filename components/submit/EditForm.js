import { useCallback } from 'react'
import { Box, Button, Flex, Heading, Label as LLabel } from 'ooni-components'
import { Input } from 'ooni-components/dist/components'

import CategoryList from './CategoryList'

const Label = ({ children }) => <LLabel fontWeight='bold' my={2} fontSize={1}>{children}</LLabel>

export const EditForm = ({ oldEntry, error, onSubmit, onCancel, layout = 'column' }) => {
  const isEdit = 'url' in oldEntry

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const categoryCode = formData.get('category_code')
    const today = new Date().toISOString().split('T')[0]

    const newEntry = {
      url: formData.get('url'),
      category_code: categoryCode,
      date_added: oldEntry.date_added ?? today,
      source: oldEntry.source ?? '',
      notes: formData.get('notes')
    }

    const comment = formData.get('comment')

    onSubmit(newEntry, comment)
  }, [oldEntry.date_added, oldEntry.source, onSubmit])

  const width = layout === 'row' ? (1 / 4) : 1

  return (
    <form onSubmit={handleSubmit}>
      <Heading h={4}>{isEdit ? `Editing ${oldEntry.url}` : 'Add new URL'}</Heading>
      <Flex flexDirection={layout} my={2} mx={2} alignItems='center'>

        <Flex flexDirection='column' my={2} width={width} px={3}>
          <Label htmlFor='url'>URL</Label>
          <Input name='url' type='text' required={true} placeholder='https://example.com/' defaultValue={oldEntry.url} />
        </Flex>

        <Flex flexDirection='column' my={2} width={width}>
          <Label htmlFor='category_code'>Category</Label>
          <CategoryList name='category_code' defaultValue={oldEntry.category_code} required={true} />
        </Flex>

        <Flex flexDirection='column' my={2} width={width} px={3}>
          <Label htmlFor='notes'>Notes</Label>
          <Input name='notes' type='text' required={true} placeholder='' defaultValue={oldEntry.notes} />
        </Flex>

        <Flex flexDirection='column' my={2} width={width} px={3}>
          <Label htmlFor='comment'>Comment</Label>
          <Input name='comment' type='text' required={true} placeholder='Reason' defaultValue={oldEntry.comment} />
        </Flex>

        {isEdit && (
          <Flex alignSelf={isEdit ? 'flex-end' : 'initial'}>
              <Button inverted onClick={onCancel} mr={3}>Cancel</Button>
              <Button type='submit'>Done</Button>
          </Flex>
        )}

        {!isEdit && <Button type='submit' hollow>Add</Button>}
      </Flex>
      <Box as='small' color='red6'> {error} </Box>
    </form>
  )
}
