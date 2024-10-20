import { useQuery, useQueryClient } from '@tanstack/react-query'

import { RoomService } from '@/services/api'
import { TRoom } from '@/types'

export const useRoom = (roomId?: string) => {
  const queryClient = useQueryClient()

  const queryResult = useQuery<TRoom | null>({
    queryKey: ['room-detail', roomId],
    enabled: !!roomId,
    queryFn: async () => {
      if (!roomId) return null
      return await RoomService.getRoomDetail(roomId)
    },
  })

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['room-detail', roomId],
    })
  }

  const setData = (newData: TRoom) => {
    queryClient.setQueryData(['room-detail', newData.id], newData)
  }

  return {
    ...queryResult,
    refresh,
    setData,
  }
}
