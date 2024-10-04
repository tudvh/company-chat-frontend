export type TApiResponseError = {
  message?: string
  response?: {
    data: {
      message?: string | string[]
      status?: number
    }
  }
} & string
