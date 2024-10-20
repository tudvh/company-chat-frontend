import { RoomTypeEnum } from '@/enums'
import { TChannelDetail } from '@/types'

export const getDefaultRoomId = (channel: TChannelDetail) => {
  const roomId = channel.groups
    .flatMap(group => group.rooms)
    .find(room => room.type === RoomTypeEnum.Chat)?.id
  return roomId
}
