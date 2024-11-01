import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { AlertParams, ConfirmParams, InputFileParams, InputTextParams } from '@/types/utils/alert'

export class AlertUtil {
  private static MySwal = withReactContent(Swal)

  public static async alert({ title, text, icon = 'info' }: AlertParams): Promise<void> {
    await this.MySwal.fire({
      title,
      text,
      icon,
    })
  }

  public static async confirm({
    title,
    text,
    confirmButtonText = 'Xác nhận',
    cancelButtonText = 'Hủy',
    icon = 'warning',
  }: ConfirmParams): Promise<boolean> {
    const result = await this.MySwal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    })

    return result.isConfirmed
  }

  public static async inputText({
    title,
    inputPlaceholder = 'Nhập',
  }: InputTextParams): Promise<string | null> {
    const result = await this.MySwal.fire({
      title,
      input: 'text',
      inputPlaceholder,
    })

    return result.value || null
  }

  public static async inputFile({ title }: InputFileParams): Promise<File | null> {
    const result = await this.MySwal.fire({
      title,
      input: 'file',
    })

    return result.value.file || null
  }
}
