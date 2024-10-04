import { UseFormSetError } from 'react-hook-form'

import { TApiResponseError } from '@/types'
import { ToastUtil } from '@/utils'

export const displayApiError = (error: TApiResponseError): void => {
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
    ToastUtil.error(errorMessage)
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
