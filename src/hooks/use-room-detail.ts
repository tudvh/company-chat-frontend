import { useQuery, useQueryClient } from '@tanstack/react-query'

import { RoomService } from '@/services/api'
import { TRoom } from '@/types'

const QUERY_KEY = 'room-detail' as const

export const useRoomDetail = (roomId?: string) => {
  const queryClient = useQueryClient()

  const {
    data: room,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<TRoom | null>({
    queryKey: [QUERY_KEY, roomId],
    enabled: Boolean(roomId),
    queryFn: async () => {
      if (!roomId) return null
      return await RoomService.getRoomDetail(roomId)
    },
  })

  const invalidateRoom = () => {
    if (!roomId) return
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY, roomId],
    })
  }

  const updateRoom = (updatedRoom: TRoom) => {
    queryClient.setQueryData([QUERY_KEY, updatedRoom.id], updatedRoom)
  }

  return {
    room,
    isLoading,
    isError,
    error,
    isFetching,
    invalidateRoom,
    updateRoom,
  }
}
