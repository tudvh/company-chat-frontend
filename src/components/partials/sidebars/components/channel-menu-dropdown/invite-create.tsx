import { ROUTES } from '@/configs'
import { ChannelService } from '@/services/api'
import { TChannel } from '@/types'
import { ToastUtil } from '@/utils'
import { useEffect, useState } from 'react'

interface InviteCreateProps {
  isModalOpen: boolean
  onClose: () => void
  channel: TChannel
}

export const InviteCreate = ({ isModalOpen, channel }: InviteCreateProps) => {
  const [url, setUrl] = useState('')
  const [coppied, setCoppied] = useState(false)

  const getLinkInvite = async () => {
    const { inviteString } = await ChannelService.getLinkInvite(channel.id)
    const url = `${ROUTES.CHANNEL_JOIN.replace(':code', inviteString)}`
    setUrl(url)
  }

  const coppyToClipBoard = (url: string) => {
    if (url) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCoppied(true)
          ToastUtil.success('Đã sao chép')
        })
        .catch(() => {
          ToastUtil.error('Có lỗi')
        })
    }
  }

  useEffect(() => {
    if (isModalOpen) {
    }
  }, [isModalOpen])

  useEffect(() => {
    getLinkInvite()
  }, [])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
          <span className="grow">{url}</span>
          <button
            onClick={() => coppyToClipBoard(url)}
            className="items-center justify-center text-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {!coppied && (
              <span id="default-message" className="inline-flex items-center">
                <svg
                  className="me-1.5 h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                </svg>
                <span className="text-xs font-semibold">Sao chép</span>
              </span>
            )}
            {coppied && (
              <span id="success-message" className="inline-flex items-center">
                <svg
                  className="me-1.5 h-3 w-3 text-blue-700 dark:text-blue-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-500">
                  Đã sao chép
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
