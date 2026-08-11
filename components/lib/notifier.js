import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

const NotifyComponent = () => <Toaster position='top-right' />

export const useNotifier = () => {
  const Notification = React.memo(NotifyComponent)
  const error = (message) => {
    toast.error(
      (t) => {
        return (
          <div className="flex w-full items-center justify-between">
            <span className="w-4/5">{message}</span>
            <button
              className="btn btn-dark-hollow text-xs"
              type="button"
              onClick={() => toast.dismiss(t.id)}
            >
              Dismiss
            </button>
          </div>
        )
      },
      {
        duration: Number.Infinity,
        position: 'top-right',
        style: { maxWidth: '600px' },
      },
    )
  }
  return {
    toast,
    notify: { ...toast, error },
    Notification,
  }
}
