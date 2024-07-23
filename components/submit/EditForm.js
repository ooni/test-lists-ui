import { Box, Button, Flex, Heading, Input, Select } from 'ooni-components'
import { useCallback, useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import categories from '../lib/category_codes.json'
import { SubmissionContext } from './SubmissionContext'

// Regular expression to test for valid URLs based on
// https://github.com/citizenlab/test-lists/blob/master/scripts/lint-lists.py#L18
// FIX: This regex works at https://regexr.com/629v6 but not here. Using a generic regex in the URL input below
// const urlRegex = /^(?:http)s?:\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.|[A-Z0-9-]{2,}\.?)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[/?]\S+)$/i

const HorizontalLine = styled.hr`
  border: 1px solid ${(props) => props.theme.colors.gray5};
  width: 100%;
`

const defaultSource = 'test-lists.ooni.org contribution'

export const EditForm = ({
  oldEntry,
  onSubmit,
  onCancel,
  layout = 'column',
}) => {
  const { formatMessage } = useIntl()
  const [submitting, setSubmitting] = useState(false)
  const { countryCode } = useContext(SubmissionContext)

  const { control, handleSubmit, formState } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      url: oldEntry.url || '',
      category_code: oldEntry.category_code || '',
      notes: oldEntry.notes || '',
      comment: oldEntry.comment || '',
    },
  })

  const isEdit = 'url' in oldEntry

  const submit = useCallback(
    async (data) => {
      setSubmitting(true)
      const today = new Date().toISOString().split('T')[0]
      // Add a trailing slash to the URL
      // * if not already added by user
      // * if the URL doesn't contain a path component (e.g "https://ooni.org/blog/test-lists")
      let url = data?.url
      if (!url.endsWith('/') && !url.match(/\..+\/.+/)) {
        url = `${url}/`
      }
      const newEntry = {
        url,
        category_code: data?.category_code,
        date_added: oldEntry.date_added ?? today,
        source: oldEntry.source ?? defaultSource,
        notes: data?.notes,
      }
      const comment = data?.comment || `Added ${url} to ${countryCode}.csv`

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
    },
    [countryCode, oldEntry.date_added, oldEntry.source, onSubmit],
  )

  const width = layout === 'row' ? [1, 1, 2 / 8] : 1

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Heading h={4} mx={0} px={0}>
        {isEdit
          ? formatMessage({ id: 'EditForm.AddNew' }, { url: oldEntry.url })
          : formatMessage({ id: 'EditForm.AddNew' })}
      </Heading>
      <Flex flexDirection={layout} my={2} alignItems='end' flexWrap='wrap'>
        <Flex flexDirection='column' width={width}>
          <Box m={2}>
            <Controller
              name='url'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  required
                  pattern='https?:\/\/(www\.)?[\-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,24}\b([\-a-zA-Z0-9@:%_\\+.~#?&\/=]*)'
                  label={`${formatMessage({ id: 'Changes.URL' })}*`}
                  placeholder='https://example.com/&lrm;'
                />
              )}
            />
          </Box>
        </Flex>

        <Flex flexDirection='column' width={width}>
          <Box m={2}>
            <Controller
              name='category_code'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  required
                  label={`${formatMessage({ id: 'Changes.Category' })}*`}
                >
                  <option value=''>
                    {formatMessage({ id: 'CategoryList.Select' })}
                  </option>
                  {Object.entries(categories)
                    .sort((c1, c2) => (c1[1] > c2[1] ? 1 : -1))
                    .map(([code]) => (
                      <option
                        key={code}
                        value={code}
                        title={formatMessage({
                          id: `CategoryCode.${code}.Description`,
                        })}
                      >
                        {formatMessage({ id: `CategoryCode.${code}.Name` })}
                      </option>
                    ))}
                </Select>
              )}
            />
          </Box>
        </Flex>

        <Flex
          flexDirection='column'
          width={layout === 'row' ? [1, 1, 4 / 8] : 1}
        >
          <Box m={2}>
            <Controller
              name='notes'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={formatMessage({ id: 'Changes.Notes' })}
                  placeholder={formatMessage({
                    id: 'EditForm.NotesPlaceholder',
                  })}
                />
              )}
            />
          </Box>
        </Flex>

        {isEdit && (
          <Box width={1}>
            <HorizontalLine />
            <Flex flexDirection='column' m={2} width={width} flexGrow={'auto'}>
              <Controller
                name='comment'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    required
                    label={formatMessage({ id: 'EditForm.Comment' })}
                    placeholder={formatMessage({
                      id: 'EditForm.NotesPlaceholder',
                    })}
                  />
                )}
              />
            </Flex>
            <Flex alignSelf={isEdit ? 'flex-end' : 'initial'}>
              <Button inverted onClick={onCancel} mr={3}>
                {formatMessage({ id: 'DeleteForm.Cancel' })}
              </Button>
              <Button type='submit'>
                {formatMessage({ id: 'EditForm.Done' })}
              </Button>
            </Flex>
          </Box>
        )}

        {!isEdit && (
          <Button ml='auto' type='submit' my={2} hollow disabled={submitting}>
            {formatMessage({ id: 'EditForm.Add' })}
          </Button>
        )}
      </Flex>
    </form>
  )
}
