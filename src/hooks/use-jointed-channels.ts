import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ChannelService } from '@/services/api'
import { TChannel } from '@/types'

export const useJointedChannels = (userId?: string) => {
  const queryClient = useQueryClient()

  const queryResult = useQuery<TChannel[]>({
    queryKey: ['jointed-channels', userId],
    enabled: !!userId,
    queryFn: ChannelService.getJointedChannels,
  })

  const refresh = () => {
    if (!userId) return
    queryClient.invalidateQueries({
      queryKey: ['jointed-channels', userId],
    })
  }

  const setData = (newData: TChannel) => {
    if (!userId) return
    queryClient.setQueryData(['jointed-channels', userId], newData)
  }

  return {
    ...queryResult,
    refresh,
    setData,
  }
}
