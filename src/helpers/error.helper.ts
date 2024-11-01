import { UseFormSetError } from 'react-hook-form'

import { AlertUtil, ToastUtil } from '@/utils'

interface DisplayErrorOptions {
  title: string
}

export const displayError = async (error: any, options?: DisplayErrorOptions): Promise<void> => {
  try {
    let errorMessage: string
    if (Array.isArray(error.response?.data?.message)) {
      errorMessage = (error.response.data.message as string[]).join(', ')
    } else {
      errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again later.'
    }
    if (options) {
      await AlertUtil.alert({ title: options.title, text: errorMessage, icon: 'error' })
    } else {
      ToastUtil.error(errorMessage)
    }
  } catch (err) {
    ToastUtil.error('An unexpected error occurred.')
    console.error('Error handling response error:', err)
  }
}

export const setCustomErrorToField = (
  field: string,
  message: string,
  setError: UseFormSetError<Record<string, string[]>>,
) => {
  if (!message) return
  setError(field, {
    type: 'manual',
    message: message,
  })
}
