import { ChevronRight, Volume2 } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { SharpIcon } from '@/components/icons'
import { ROUTES } from '@/configs'
import { RoomTypeEnum } from '@/enums'
import { useChannelDetail, useRoomDetail } from '@/hooks'
import { cn } from '@/lib/utils'
import { MenuDropdown } from './channel-menu-dropdown'

export const RoomList = () => {
  const { channelId, roomId } = useParams()
  const { channelDetail } = useChannelDetail(channelId)
  const { updateRoom } = useRoomDetail()

  useEffect(() => {
    if (!channelDetail) return
    channelDetail.groups.forEach(group => {
      group.rooms.forEach(room => {
        updateRoom(room)
      })
    })
  }, [channelDetail])

  return (
    <div className="flex h-full flex-1 flex-col bg-primary/5">
      {channelId && channelDetail && (
        <>
          <MenuDropdown channel={channelDetail} />
          <ul className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-5">
            {channelDetail.groups.map(group => (
              <div key={group.id} className="space-y-1 font-medium text-muted-foreground">
                <div className="flex gap-1">
                  <ChevronRight className="size-3.5" />
                  <span className="text-xs uppercase">{group.name}</span>
                </div>
                {group.rooms.map(room => (
                  <Link
                    key={room.id}
                    to={ROUTES.ROOM.replace(':channelId', channelId).replace(':roomId', room.id)}
                    className={cn(
                      'flex items-center gap-2 rounded px-2 py-1 text-primary',
                      roomId === room.id && 'bg-primary/10',
                    )}
                  >
                    {room.type === RoomTypeEnum.Chat ? (
                      <SharpIcon className="size-5 font-normal text-muted-foreground" />
                    ) : room.type === RoomTypeEnum.Call ? (
                      <Volume2 className="size-5 font-normal text-muted-foreground" />
                    ) : null}
                    <span className="line-clamp-1 flex-1">{room.name}</span>
                  </Link>
                ))}
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
