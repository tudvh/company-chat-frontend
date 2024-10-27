import { useParams } from 'react-router-dom'

import { RoomTypeEnum } from '@/enums'
import { useRoomDetail } from '@/hooks'
import { CallRoomPage } from './CallRoom'
import { ChatRoomPage } from './ChatRoom'

export const RoomPage = () => {
  const { roomId } = useParams()
  const { room } = useRoomDetail(roomId)

  if (!room) {
    return null
  }

  if (room.type === RoomTypeEnum.Call) {
    return <CallRoomPage />
  }

  if (room.type === RoomTypeEnum.Chat) {
    return <ChatRoomPage room={room} />
  }

  return null
}
