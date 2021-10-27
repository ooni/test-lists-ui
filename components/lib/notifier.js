import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

const NotifyComponent = () => <Toaster position='top-right' />

export const useNotifier = () => {
  const Notification = React.memo(NotifyComponent)
  return {
    toast,
    notify: toast,
    Notification
  }
}
