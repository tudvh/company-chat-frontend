import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ChannelService } from '@/services/api'
import { TChannel } from '@/types'

const QUERY_KEY = 'channels' as const

export const useChannels = (userId?: string) => {
  const queryClient = useQueryClient()

  const {
    data: channels,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<TChannel[]>({
    queryKey: [QUERY_KEY, userId],
    enabled: Boolean(userId),
    queryFn: ChannelService.getChannels,
  })

  const invalidateChannels = () => {
    if (!userId) return
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY, userId],
    })
  }

  const updateChannels = (updatedChannels: TChannel[]) => {
    if (!userId) return
    queryClient.setQueryData([QUERY_KEY, userId], updatedChannels)
  }

  const prependChannel = (newChannel: TChannel) => {
    if (!userId) return
    queryClient.setQueryData([QUERY_KEY, userId], (prevChannels: TChannel[] | undefined) => {
      if (!prevChannels) return [newChannel]
      return [newChannel, ...prevChannels]
    })
  }

  return {
    channels,
    isLoading,
    isError,
    error,
    isFetching,
    invalidateChannels,
    updateChannels,
    prependChannel,
  }
}
