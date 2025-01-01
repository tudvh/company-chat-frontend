import { TMessageUser } from './user'

export type GetAllMessagesByRoomParams = {
  roomId: string
}

export type TMessage = {
  id: string
  content: string
  sender: TMessageUser
  attachments: TMessageAttachment[]
  createdAt: string
  updatedAt: string
}

export type TMessageAttachment = {
  id: string
  fileName: string
  fileType: string
  fileUrl: string
}
