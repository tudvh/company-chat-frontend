import { ChevronDown, ChevronRight, Volume2 } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { SharpIcon } from '@/components/icons'
import { ROUTES } from '@/configs'
import { RoomTypeEnum } from '@/enums'
import { useMyChannelDetail, useRoom } from '@/hooks'
import { cn } from '@/lib/utils'

export const RoomList = () => {
  const { channelId, roomId } = useParams()
  const { data: myChannelDetail } = useMyChannelDetail(channelId)
  const { setData: setRoomData } = useRoom()

  useEffect(() => {
    if (!myChannelDetail) return
    myChannelDetail.groups.forEach(group => {
      group.rooms.forEach(room => {
        setRoomData(room)
      })
    })
  }, [myChannelDetail])

  return (
    <div className="flex h-full flex-1 flex-col bg-primary/5">
      {channelId && myChannelDetail && (
        <>
          <button className="flex h-12 w-full items-center justify-between gap-3 border-b px-4 font-bold">
            <h1 className="line-clamp-1 flex-1 text-left">{myChannelDetail.name}</h1>
            <ChevronDown className="size-5" />
          </button>
          <ul className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-5">
            {myChannelDetail.groups.map(group => (
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
