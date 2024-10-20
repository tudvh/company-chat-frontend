import { Volume2 } from 'lucide-react'

import { SharpIcon } from '@/components/icons'
import { RoomTypeEnum } from '@/enums'
import { TRoom } from '@/types'

interface ChatRoomPageProps {
  room: TRoom
}

export const ChatRoomPage = ({ room }: ChatRoomPageProps) => {
  return (
    <div className="flex h-12 w-full items-center justify-between gap-3 border-b px-4 font-bold">
      {room.type === RoomTypeEnum.Chat ? (
        <SharpIcon className="size-5 font-normal text-muted-foreground" />
      ) : room.type === RoomTypeEnum.Call ? (
        <Volume2 className="size-5 font-normal text-muted-foreground" />
      ) : null}
      <h1 className="line-clamp-1 flex-1 text-left">{room.name}</h1>
    </div>
  )
}
