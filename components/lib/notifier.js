import { Flex, Box, Button } from 'ooni-components'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

const NotifyComponent = () => <Toaster position='top-right' />

export const useNotifier = () => {
  const Notification = React.memo(NotifyComponent)
  const error = (message) => {
    toast.error((t) => {
      return (
        <Flex justifyContent='space-between' alignItems='center' sx={{ width: '100%' }}>
          <Box>{message}</Box>
          <Button inverted fontSize={12} onClick={() => toast.dismiss(t.id)}>Dismiss</Button>
        </Flex>
      )
    }, { duration: Infinity, position: 'top-right', style: { minWidth: '500px' } })
  }
  return {
    toast,
    notify: { ...toast, error },
    Notification
  }
}
