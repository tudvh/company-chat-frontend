import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ChannelService } from '@/services/api'
import { TChannelDetail } from '@/types'

export const useJointedChannelDetail = (channelId?: string) => {
  const queryClient = useQueryClient()

  const queryResult = useQuery<TChannelDetail | null>({
    queryKey: ['jointed-channel-detail', channelId],
    enabled: !!channelId,
    queryFn: async () => {
      if (!channelId) return null
      return await ChannelService.getJointedChannelDetail(channelId)
    },
  })

  const refresh = () => {
    if (!channelId) return
    queryClient.invalidateQueries({
      queryKey: ['jointed-channel-detail', channelId],
    })
  }

  const setData = (newData: TChannelDetail) => {
    queryClient.setQueryData(['jointed-channel-detail', newData.id], newData)
  }

  return {
    ...queryResult,
    refresh,
    setData,
  }
}
