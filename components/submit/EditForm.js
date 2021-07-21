import { useCallback } from 'react'
import { Box, Button, Flex, Heading, Label as LLabel } from 'ooni-components'
import { Input } from 'ooni-components/dist/components'

import CategoryList from './CategoryList'

// Regular expression to test for valid URLs based on
// https://github.com/citizenlab/test-lists/blob/master/scripts/lint-lists.py#L18
// FIX: This regex works at https://regexr.com/629v6 but not here. Using a generic regex in the URL input below
// const urlRegex = /^(?:http)s?:\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.|[A-Z0-9-]{2,}\.?)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[/?]\S+)$/i

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
    // TODO: This can be improved by waiting for a successful submit before clearing the form
    e.target.reset()
  }, [oldEntry.date_added, oldEntry.source, onSubmit])

  const width = layout === 'row' ? (1 / 4) : 1

  return (
    <form onSubmit={handleSubmit}>
      <Heading h={4}>{isEdit ? `Editing ${oldEntry.url}` : 'Add new URL'}</Heading>
      <Flex flexDirection={layout} my={2} mx={2} alignItems='center'>

        <Flex flexDirection='column' my={2} width={width} px={3}>
          <Label htmlFor='url'>URL</Label>
          <Input
            name='url'
            type='text'
            required={true}
            pattern='https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)'
            placeholder='https://example.com/'
            defaultValue={oldEntry.url}
          />
        </Flex>

        <Flex flexDirection='column' my={2} width={width}>
          <Label htmlFor='category_code'>Category</Label>
          <CategoryList name='category_code' defaultValue={oldEntry.category_code || ''} required={true} />
        </Flex>

        <Flex flexDirection='column' my={2} width={width} px={3}>
          <Label htmlFor='notes'>Notes</Label>
          <Input name='notes' type='text' placeholder='' defaultValue={oldEntry.notes} />
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
