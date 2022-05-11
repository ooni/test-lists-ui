import { Modal } from 'ooni-components'
import React, { useCallback, useEffect } from 'react'

type ModalWithEscProps = {
  onCancel: () => void
  show: boolean
  onHideClick: () => void
  children: React.ReactNode
}

const ModalWithEsc: React.FunctionComponent<ModalWithEscProps> = ({ onCancel, ...rest }) => {
  const onKeyPress = useCallback((e: KeyboardEvent) => {
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

  return (<Modal {...rest} />)
}

export default ModalWithEsc
