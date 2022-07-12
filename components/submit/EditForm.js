import { useCallback, useState, useContext } from 'react'
import { Button, Flex, Heading, Label as LLabel, Input } from 'ooni-components'
import styled from 'styled-components'

import CategoryList from './CategoryList'
import { SubmissionContext } from './SubmissionContext'

// Regular expression to test for valid URLs based on
// https://github.com/citizenlab/test-lists/blob/master/scripts/lint-lists.py#L18
// FIX: This regex works at https://regexr.com/629v6 but not here. Using a generic regex in the URL input below
// const urlRegex = /^(?:http)s?:\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.|[A-Z0-9-]{2,}\.?)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[/?]\S+)$/i

const Label = ({ children, required }) => {
  const css = required ? { '&::after': { content: "'*'", marginLeft: '2px' } } : null
  return (
    <LLabel fontWeight='bold' my={2} fontSize={1} css={css}>
      {children}
    </LLabel>
  )
}

const HorizontalLine = styled.hr`
  border: 1px solid ${props => props.theme.colors.gray5};
  width: 100%;
`

const defaultSource = 'test-lists.ooni.org contribution'

export const EditForm = ({ oldEntry, error, onSubmit, onCancel, layout = 'column' }) => {
  const [submitting, setSubmitting] = useState(false)
  const { countryCode } = useContext(SubmissionContext)

  const isEdit = 'url' in oldEntry

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.target)
    const categoryCode = formData.get('category_code')
    const today = new Date().toISOString().split('T')[0]

    // Add a trailing slash to the URL
    // * if not already added by user
    // * if the URL doesn't contain a path component (e.g "https://ooni.org/blog/test-lists")
    let url = formData.get('url')
    if (!url.endsWith('/') && !url.match(/\..+\/.+/)) {
      url = url + '/'
    }

    const newEntry = {
      url: url,
      category_code: categoryCode,
      date_added: oldEntry.date_added ?? today,
      source: oldEntry.source ?? defaultSource,
      notes: formData.get('notes')
    }

    const comment = formData.has('comment')
      ? formData.get('comment')
      : `Added ${url} to ${countryCode}.csv`

    try {
      await onSubmit(newEntry, comment)
      console.debug('onSubmit succeeded')
      e.target.reset()
    } catch (e) {
      // Submit failed, don't change form state yet
      console.debug(`Submit failed: ${e}`)
    } finally {
      setSubmitting(false)
    }
  }, [countryCode, oldEntry.date_added, oldEntry.source, onSubmit])

  const width = layout === 'row' ? [1, (2 / 8)] : 1

  return (
    <form onSubmit={handleSubmit}>
      <Heading h={4} mx={0} px={0}>
        {isEdit ? `Editing ${oldEntry.url}` : 'Add new URL'}
      </Heading>
      <Flex flexDirection={layout} my={2} alignItems="center" flexWrap="wrap">
        <Flex flexDirection="column" my={2} width={width}>
          <Label htmlFor="url" required={true}>URL</Label>
          <Input
            name="url"
            type="text"
            required={true}
            pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)"
            placeholder="https://example.com/"
            defaultValue={oldEntry.url}
          />
        </Flex>

        <Flex flexDirection="column" m={2} width={width}>
          <Label htmlFor="category_code" required={true}>Category</Label>
          <CategoryList
            name="category_code"
            defaultValue={oldEntry.category_code || ''}
            required={true}
          />
        </Flex>

        <Flex flexDirection="column" m={2} width={width}>
          <Label htmlFor="notes">Notes</Label>
          <Input
            name="notes"
            type="text"
            placeholder="Document any useful context for this URL"
            defaultValue={oldEntry.notes}
          />
        </Flex>

        {isEdit && <HorizontalLine />}

        {isEdit && (
          <Flex flexDirection="column" my={2} width={width} flexGrow={'auto'}>
            <Label htmlFor="comment" required={true}>Comment</Label>
            <Input
              name="comment"
              type="text"
              required={true}
              placeholder="Please share why you are updating this URL"
              defaultValue={oldEntry.comment}
            />
          </Flex>
        )}

        {isEdit && (
          <Flex alignSelf={isEdit ? 'flex-end' : 'initial'}>
            <Button inverted onClick={onCancel} mr={3}>
              Cancel
            </Button>
            <Button type="submit">Done</Button>
          </Flex>
        )}

        {!isEdit && (
          <Button ml="auto" type="submit" hollow disabled={submitting}>
            Add
          </Button>
        )}
      </Flex>
    </form>
  )
}
