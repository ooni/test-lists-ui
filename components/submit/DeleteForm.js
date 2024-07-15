import { Button, Flex, Heading, Input } from 'ooni-components'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const DeleteForm = ({ oldEntry, onDelete, onCancel, error }) => {
  const { formatMessage } = useIntl()
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const comment = formData.get('comment')
      onDelete(null, comment)
    },
    [onDelete],
  )

  return (
    <form onSubmit={handleSubmit}>
      <Heading h={5} my={3}>
        {formatMessage({ id: 'DeleteForm.Why' }, { url: oldEntry.url })}
      </Heading>
      <Flex flexDirection='column' my={4} mx={2}>
        <Input
          name='comment'
          placeholder={formatMessage({ id: 'DeleteForm.Reason' })}
          required
        />
      </Flex>
      <Flex justifyContent='space-between' width={1} my={3}>
        <Button hollow onClick={onCancel}>
          {formatMessage({ id: 'DeleteForm.Cancel' })}
        </Button>
        <Button type='submit'>
          {formatMessage({ id: 'DeleteForm.Delete' })}
        </Button>
      </Flex>
    </form>
  )
}

export default DeleteForm
