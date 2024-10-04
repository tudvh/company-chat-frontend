import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { AlertParams, ConfirmParams, InputFileParams, InputTextParams } from '@/types/utils/alert'

export class AlertUtil {
  private static MySwal = withReactContent(Swal)

  public static alert(params: AlertParams): void {
    const { title, text, icon = 'question' } = params

    this.MySwal.fire({
      title,
      text,
      icon,
    })
  }

  public static async confirm(params: ConfirmParams): Promise<boolean> {
    const {
      title,
      confirmButtonText = 'Xác nhận',
      cancelButtonText = 'Hủy',
      icon = 'warning',
    } = params

    const result = await this.MySwal.fire({
      title,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    })

    return result.isConfirmed
  }

  public static async inputText(params: InputTextParams): Promise<string | null> {
    const { title, inputPlaceholder = 'Nhập' } = params

    const result = await this.MySwal.fire({
      title,
      input: 'text',
      inputPlaceholder,
    })

    return result.value || null
  }

  public static async inputFile(params: InputFileParams): Promise<File | null> {
    const { title } = params

    const result = await this.MySwal.fire({
      title,
      input: 'file',
    })

    return result.value.file || null
  }
}
