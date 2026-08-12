import { Input } from 'ooni-components'
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
      <h5 className="my-4">
        {formatMessage({ id: 'DeleteForm.Why' }, { url: oldEntry.url })}
      </h5>
      <div className="mx-2 my-8 flex flex-col">
        <Input
          name='comment'
          placeholder={formatMessage({ id: 'DeleteForm.Reason' })}
          required
        />
      </div>
      <div className="my-4 flex w-full justify-between">
        <button
          className="btn btn-primary-hollow"
          type="button"
          onClick={onCancel}
        >
          {formatMessage({ id: 'DeleteForm.Cancel' })}
        </button>
        <button className="btn btn-primary" type='submit'>
          {formatMessage({ id: 'DeleteForm.Delete' })}
        </button>
      </div>
    </form>
  )
}

export default DeleteForm
