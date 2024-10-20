import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ChannelService } from '@/services/api'
import { TChannelDetail } from '@/types'

export const useMyChannelDetail = (channelId?: string) => {
  const queryClient = useQueryClient()

  const queryResult = useQuery<TChannelDetail | null>({
    queryKey: ['my-channel-detail', channelId],
    enabled: !!channelId,
    queryFn: async () => {
      if (!channelId) return null
      return await ChannelService.getMyChannelDetail(channelId)
    },
  })

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['my-channel-detail', channelId],
    })
  }

  const setData = (newData: TChannelDetail) => {
    queryClient.setQueryData(['my-channel-detail', newData.id], newData)
  }

  return {
    ...queryResult,
    refresh,
    setData,
  }
}
