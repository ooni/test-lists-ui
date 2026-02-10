import { Modal } from 'ooni-components'
import { useCallback, useEffect } from 'react'

const ModalWithEsc = ({ onHideClick, onCancel, ...rest }) => {
  const onKeyPress = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    },
    [onCancel],
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress)
    return () => {
      document.removeEventListener('keydown', onKeyPress)
    }
  }, [onKeyPress])

  return <Modal {...rest} />
}

export default ModalWithEsc
