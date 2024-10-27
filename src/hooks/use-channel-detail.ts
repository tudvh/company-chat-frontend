import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ChannelService } from '@/services/api'
import { TChannelDetail } from '@/types'

const QUERY_KEY = 'channel-detail' as const

export const useChannelDetail = (channelId?: string) => {
  const queryClient = useQueryClient()

  const {
    data: channelDetail,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<TChannelDetail | null>({
    queryKey: [QUERY_KEY, channelId],
    enabled: Boolean(channelId),
    queryFn: async () => {
      if (!channelId) return null
      return await ChannelService.getChannelDetail(channelId)
    },
  })

  const invalidateChannelDetail = () => {
    if (!channelId) return
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY, channelId],
    })
  }

  const updateChannelDetail = (updatedChannel: TChannelDetail) => {
    queryClient.setQueryData([QUERY_KEY, updatedChannel.id], updatedChannel)
  }

  return {
    channelDetail,
    isLoading,
    isError,
    error,
    isFetching,
    invalidateChannelDetail,
    updateChannelDetail,
  }
}
