import { useCallback } from 'react'
import { Button, Flex, Heading, Input } from 'ooni-components'

const DeleteForm = ({ oldEntry, onDelete, onCancel, error }) => {
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
      <Heading h={4} my={3}>
        Why are you deleting {oldEntry.url}?
      </Heading>
      <Flex flexDirection='column' my={4} mx={2}>
        <Input
          name='comment'
          placeholder='Enter reason for deletion'
          required
        />
      </Flex>
      <Flex justifyContent='space-between' width={1} my={3}>
        <Button hollow onClick={onCancel}>
          {' '}
          Cancel{' '}
        </Button>
        <Button type='submit'> Delete </Button>
      </Flex>
    </form>
  )
}

export default DeleteForm
