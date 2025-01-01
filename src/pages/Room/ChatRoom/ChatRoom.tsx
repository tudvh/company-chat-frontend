import { FileIcon, Plus, SendIcon, X } from 'lucide-react'
import { Channel } from 'pusher-js'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { SharpIcon } from '@/components/icons'
import { Button, Textarea } from '@/components/ui'
import { useAuth, usePusher } from '@/contexts'
import { displayError } from '@/helpers'
import { cn } from '@/lib/utils'
import { MessageService } from '@/services/api'
import { TMessage, TRoom } from '@/types'
import { LoadingMessageItem } from './LoadingMessageItem'
import { MessageItem } from './MessageItem'

interface ChatRoomPageProps {
  room: TRoom
}

export const ChatRoomPage = ({ room }: ChatRoomPageProps) => {
  const { subscribeToChannel, unsubscribeFromChannel, bindEventToChannel } = usePusher()
  const { userProfile } = useAuth()
  const [messages, setMessages] = useState<TMessage[]>([])
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [pusherChannel, setPusherChannel] = useState<Channel>()
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getAllMessages = async () => {
    try {
      setIsLoadingMessages(true)
      const data = await MessageService.getAllMessagesByRoom({
        roomId: room.id,
      })
      setMessages(data)
    } catch (error) {
      displayError(error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resizeTextArea = () => {
    if (!textareaRef.current) return

    textareaRef.current.style.height = 'auto'

    if (textareaRef.current.scrollHeight <= 200) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      textareaRef.current.style.overflowY = 'hidden'
    } else {
      textareaRef.current.style.height = '200px'
      textareaRef.current.style.overflowY = 'auto'
    }
  }

  const handleSendMessage = async () => {
    const tempContent = content
    const tempFiles = files

    try {
      if (!content.trim() && files.length <= 0) return

      const formData = new FormData()
      formData.append('roomId', room.id)
      formData.append('content', content.trim())

      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('attachments', file)
        })
      }

      setIsSendingMessage(true)
      setContent('')
      setFiles([])

      await MessageService.sendMessage(formData)

      getAllMessages()
    } catch (error) {
      displayError(error)
      setContent(tempContent)
      setFiles(tempFiles)
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const fileArray: File[] = Array.from(files)
    setFiles(prev => [...(prev ?? []), ...fileArray])
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i != index))
  }

  useEffect(() => {
    getAllMessages()
    resizeTextArea()
    setPusherChannel(subscribeToChannel(room.id))

    return () => {
      unsubscribeFromChannel(room.id)
    }
  }, [])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [textareaRef])

  useEffect(() => {
    if (textareaRef.current) {
      resizeTextArea()
    }
  }, [content, textareaRef])

  useEffect(() => {
    if (!pusherChannel) return
    bindEventToChannel(room.id, 'new-message', (data: TMessage) => {
      if (data.sender.id === userProfile?.id) return
      setTimeout(() => {
        getAllMessages()
      }, 1000)
    })
  }, [pusherChannel])

  useEffect(() => {
    if (!isSendingMessage) {
      textareaRef.current?.focus()
    }
  }, [isSendingMessage])

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 items-center justify-between gap-3 border-b px-4 font-bold">
        <SharpIcon className="size-5 text-muted-foreground" />
        <h1 className="line-clamp-1 flex-1 text-left">{room.name}</h1>
      </div>
      <div className="flex flex-1 flex-col-reverse overflow-y-auto">
        <div className="mt-32 flex flex-col justify-end gap-8 px-4 pt-4">
          <div className="space-y-2">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary p-3">
              <SharpIcon className="text-primary-foreground" />
            </div>
            <h1 className="line-clamp-1 break-all text-4xl font-bold">
              Chào mừng bạn đến với #{room.name}!
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            {isLoadingMessages ? (
              <>
                <LoadingMessageItem />
                <LoadingMessageItem />
                <LoadingMessageItem />
                <LoadingMessageItem />
                <LoadingMessageItem />
              </>
            ) : (
              messages.map(message => <MessageItem key={message.id} message={message} />)
            )}
            {isSendingMessage && <LoadingMessageItem />}
          </div>
        </div>
      </div>
      <div className="p-4 pb-10">
        <div className="space-y-3 rounded-lg bg-primary/10 px-4 py-2">
          {files.length > 0 && (
            <div className="overflow-x-auto">
              <div className="flex w-fit gap-x-5 pb-2">
                {files.map((file, index) => (
                  <div
                    className="group relative h-[150px] w-[200px] overflow-hidden rounded-lg bg-background"
                    key={index}
                    title={file.name}
                  >
                    <div className="flex size-full flex-col items-center gap-2 p-3">
                      <div className="flex w-full flex-1 justify-center">
                        <FileIcon className="h-full w-auto" />
                      </div>
                      <span className="line-clamp-1 w-full text-left text-sm">{file.name}</span>
                    </div>
                    <div
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 transition duration-200 group-hover:bg-black/80"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="size-10 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex min-h-11 items-end gap-4">
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                multiple
              />
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                <label
                  htmlFor="file-upload"
                  className={cn(
                    'cursor-pointer',
                    isSendingMessage && 'pointer-events-none opacity-50',
                  )}
                >
                  <Plus />
                </label>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="w-full">
                <Textarea
                  ref={textareaRef}
                  className="h-10 min-h-10 resize-none overflow-hidden break-all rounded-sm bg-transparent px-0 py-[9px] !text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={1}
                  value={content}
                  disabled={isSendingMessage}
                  onChange={e => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={isSendingMessage}>
              <SendIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
