import { format } from 'date-fns'
import { FileIcon } from 'lucide-react'

import { UserAvatarDefault } from '@/assets/images'
import { DATE_FORMAT } from '@/constants'
import { TMessage } from '@/types'

interface MessageItemProps {
  message: TMessage
}

export const MessageItem = (props: MessageItemProps) => {
  const { message } = props

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
        <p className="break-all">{message.content}</p>
        <div className="flex flex-wrap gap-5">
          {message.attachments.map(attachment => {
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
                  className="flex items-center justify-start gap-1 rounded bg-primary/10 p-4"
                  key={attachment.id}
                >
                  <FileIcon className="size-8" />
                  <span className="line-clamp-1 cursor-pointer text-sm">{attachment.fileName}</span>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}
