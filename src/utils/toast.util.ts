import Swal, { SweetAlertIcon } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export class ToastUtil {
  private static MySwal = withReactContent(Swal)

  public static success(title: string): void {
    this.toast('success', title)
  }

  public static error(title: string): void {
    this.toast('error', title)
  }

  public static info(title: string): void {
    this.toast('info', title)
  }

  public static warning(title: string): void {
    this.toast('warning', title)
  }

  private static toast(icon: SweetAlertIcon, title: string): void {
    this.MySwal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.onmouseenter = this.MySwal.stopTimer
        toast.onmouseleave = this.MySwal.resumeTimer
      },
    }).fire({ icon, title })
  }
}
