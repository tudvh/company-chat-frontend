import { SweetAlertIcon } from 'sweetalert2'

export type AlertParams = {
  title: string
  text: string
  icon?: SweetAlertIcon
}

export type ConfirmParams = {
  title: string
  confirmButtonText?: string
  cancelButtonText?: string
  icon?: SweetAlertIcon
}

export type InputTextParams = {
  title: string
  inputPlaceholder?: string
}

export type InputFileParams = {
  title: string
}
