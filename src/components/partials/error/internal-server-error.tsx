import { Button } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

export const InternalServerErrorPage = () => {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-5">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
        <div className="flex items-center">
          <p className="text-8xl font-light text-red-700">500</p>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex items-center justify-center gap-2 text-2xl md:justify-start">
            <AlertTriangle className="text-red-700" />
            <h1>Một lỗi đã xảy ra</h1>
          </div>
          <div>
            <p>Xin lỗi, đã xảy ra một lỗi trên máy chủ của chúng tôi.</p>
            <p>Vui lòng thử lại sau hoặc liên hệ với quản trị viên.</p>
          </div>
          <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700">
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  )
}
