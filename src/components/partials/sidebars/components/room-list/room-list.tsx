import { ChevronDown, Plus, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { SharpIcon } from '@/components/icons'
import { AppDialog, AppTooltip } from '@/components/ui'
import { ROUTES } from '@/configs'
import { PermissionEnum, RoomTypeEnum } from '@/enums'
import { useChannelDetail, useChannelUserPermissions, useRoomDetail } from '@/hooks'
import { cn } from '@/lib/utils'
import { TGroup } from '@/types'
import { MenuDropdown } from '../channel-menu-dropdown'
import { RoomCreate } from './room-craete'

export const RoomList = () => {
  const { channelId, roomId } = useParams()
  const { channelDetail } = useChannelDetail(channelId)
  const { channelUserPermissions } = useChannelUserPermissions(channelId)
  const { updateRoom } = useRoomDetail()
  const [selectedGroup, setSelectedGroup] = useState<TGroup | null>(null)

  const hasCreateRoomPermission = useMemo(() => {
    if (channelDetail?.isCreator) return true
    return channelUserPermissions?.includes(PermissionEnum.CreateRoom)
  }, [channelUserPermissions, channelDetail])

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
                <div className="flex items-center gap-1 hover:text-primary/90">
                  <div className="flex flex-1 cursor-pointer items-center gap-1">
                    <ChevronDown className="size-3.5" />
                    <span className="line-clamp-1 break-all text-xs uppercase">{group.name}</span>
                  </div>
                  {hasCreateRoomPermission && (
                    <AppTooltip asChild content="Tạo kênh">
                      <button className="px-1" onClick={() => setSelectedGroup(group)}>
                        <Plus size={16} />
                      </button>
                    </AppTooltip>
                  )}
                </div>
                {group.rooms.map(room => {
                  const isActive = roomId === room.id
                  return (
                    <Link
                      key={room.id}
                      to={ROUTES.ROOM.replace(':channelId', channelId).replace(':roomId', room.id)}
                      className={cn(
                        'flex items-center gap-2 rounded px-2 py-1',
                        isActive ? 'bg-primary/10' : 'hover:bg-primary/5',
                      )}
                    >
                      {room.type === RoomTypeEnum.Chat ? (
                        <SharpIcon className="size-5 font-normal text-muted-foreground" />
                      ) : room.type === RoomTypeEnum.Call ? (
                        <Volume2 className="size-5 font-normal text-muted-foreground" />
                      ) : null}
                      <span
                        className={cn(
                          'line-clamp-1 flex-1 break-all',
                          isActive ? 'text-primary' : 'hover:text-primary/70',
                        )}
                      >
                        {room.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </ul>
          <AppDialog
            open={Boolean(selectedGroup)}
            onOpenChange={isOpen => !isOpen && setSelectedGroup(null)}
            title="Tạo kênh"
            description="Tạo kênh mới cho máy chủ"
            isStatic
          >
            {selectedGroup ? (
              <RoomCreate
                groupId={selectedGroup.id}
                isModalOpen={Boolean(selectedGroup)}
                onClose={() => setSelectedGroup(null)}
              />
            ) : (
              <></>
            )}
          </AppDialog>
        </>
      )}
    </div>
  )
}
