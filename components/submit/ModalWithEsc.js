import { Container, Modal } from 'ooni-components'
import { useCallback, useEffect } from 'react'

const ModalWithEsc = ({ onHideClick, onCancel, children, ...rest }) => {
  const onKeyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }, [onCancel])

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress)
    return () => {
      document.removeEventListener('keydown', onKeyPress)
    }
  }, [onKeyPress])

  return (
    <Modal {...rest}>
      <Container sx={{ width: ['90vw', '70vw', '50vw'] }} px={[2, 5]} py={[2, 3]} color='gray8'>
        {children}
      </Container>
    </Modal>
  )
}

export default ModalWithEsc
