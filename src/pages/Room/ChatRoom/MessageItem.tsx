import { format } from 'date-fns'
import parse from 'html-react-parser'
import { FileIcon, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { UserAvatarDefault } from '@/assets/images'
import { DATE_FORMAT } from '@/constants'
import { displayError } from '@/helpers'
import { cn } from '@/lib/utils'
import { TMessage, TMessageAttachment } from '@/types'

interface MessageItemProps {
  message: TMessage
}

export const MessageItem = (props: MessageItemProps) => {
  const { message } = props
  const [downloadingAttachmentIds, setDownloadingAttachmentIds] = useState<string[]>([])

  const transform = {
    replace: (domNode: any) => {
      if (domNode.name === 'a') {
        const to = domNode.attribs.href
        return (
          <Link to={to} className="text-blue-500 underline">
            {domNode.children[0]?.data}
          </Link>
        )
      }
    },
  }

  const handleDownloadAttachment = (attachment: TMessageAttachment) => {
    const { fileUrl, fileName } = attachment

    setDownloadingAttachmentIds(prev => [...prev, attachment.id])

    fetch(fileUrl, { method: 'GET', mode: 'cors' })
      .then(response => {
        return response.blob().then(blob => ({ blob }))
      })
      .then(({ blob }) => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${fileName || 'download'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch(error => {
        displayError(error)
      })
      .finally(() => {
        setDownloadingAttachmentIds(prev => prev.filter(id => id !== attachment.id))
      })
  }

  return (
    <div className="flex items-start gap-4 rounded px-2 py-3 hover:bg-muted" key={message.id}>
      <img
        src={message.sender.avatarUrl || UserAvatarDefault}
        className="aspect-square size-10 cursor-pointer rounded-full object-cover"
      />
      <div className="flex-1 space-y-1">
        <h3 className="flex items-center gap-2 font-bold">
          <span className="cursor-pointer hover:underline">{message.sender.fullName}</span>
          <span className="text-xs font-normal">
            {format(message.createdAt, DATE_FORMAT.DATE_TIME_DASH)}
          </span>
        </h3>
        <p className="break-all">{parse(message.content, transform)}</p>
        <div className="flex flex-wrap gap-5">
          {message.attachments?.map(attachment => {
            if (attachment.fileType.includes('image')) {
              return (
                <img
                  src={attachment.fileUrl}
                  className="aspect-square size-52 rounded object-cover"
                  key={attachment.id}
                />
              )
            } else {
              return (
                <div
                  className="relative flex items-center justify-start gap-1 overflow-hidden rounded bg-primary/10 p-4"
                  key={attachment.id}
                >
                  <FileIcon className="size-8" />
                  <span
                    className="line-clamp-1 cursor-pointer text-sm hover:underline"
                    onClick={() => handleDownloadAttachment(attachment)}
                  >
                    {attachment.fileName}
                  </span>
                  <div
                    className={cn(
                      'invisible absolute inset-0 flex items-center justify-center bg-black/70 transition duration-200',
                      downloadingAttachmentIds.includes(attachment.id) && 'visible',
                    )}
                  >
                    <LoaderCircle className="size-8 animate-spin text-white ease-linear" />
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}
