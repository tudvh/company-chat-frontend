import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ROUTES } from '@/configs'
import { getEnv } from '@/helpers'
import { cn } from '@/lib/utils'
import { ChannelService } from '@/services/api'
import { ToastUtil } from '@/utils'
import { Button } from '@/components/ui'

interface InviteCreateProps {
  isModalOpen: boolean
  channelId: string
  onClose: () => void
}

export const InviteCreate = ({ isModalOpen, channelId, onClose }: InviteCreateProps) => {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const getLinkInvite = async () => {
    const { code } = await ChannelService.getInviteCode(channelId)
    const url = `${getEnv('VITE_APP_URL')}${ROUTES.CHANNEL_JOIN.replace(':code', code)}`
    setUrl(url)
  }

  const copyToClipBoard = (url: string) => {
    if (url) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopied(true)
        })
        .catch(() => {
          ToastUtil.error('Có lỗi xảy ra, vui lòng thử lại')
        })
    }
  }

  const reset = () => {
    setCopied(false)
    setUrl('')
  }

  useEffect(() => {
    getLinkInvite()
  }, [])

  useEffect(() => {
    if (!isModalOpen) {
      reset()
    }
  }, [isModalOpen])

  return (
    <>
      <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
        <span className="grow">{url}</span>
        <button
          onClick={() => copyToClipBoard(url)}
          className="items-center justify-center text-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <div
            className={cn(
              'flex items-center gap-2 text-xs font-semibold',
              copied ? 'text-blue-700 dark:text-blue-500' : 'text-primary',
            )}
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Sao chép</span>
              </>
            )}
          </div>
        </button>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </>
  )
}
