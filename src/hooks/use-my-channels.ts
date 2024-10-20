import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ChannelService } from '@/services/api'
import { TChannel } from '@/types'

export const useMyChannels = (userId?: string) => {
  const queryClient = useQueryClient()

  const queryResult = useQuery<TChannel[]>({
    queryKey: ['my-channels', userId],
    enabled: !!userId,
    queryFn: ChannelService.getMyChannels,
  })

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['my-channels', userId],
    })
  }

  return {
    ...queryResult,
    refresh,
  }
}
