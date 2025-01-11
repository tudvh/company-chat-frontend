import { useQuery, useQueryClient } from '@tanstack/react-query'

import { PermissionEnum } from '@/enums'
import { ChannelService } from '@/services/api'

const QUERY_KEY = 'channel-user-permissions' as const

export const useChannelUserPermissions = (channelId?: string) => {
  const queryClient = useQueryClient()

  const {
    data: channelUserPermissions,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<PermissionEnum[] | null>({
    queryKey: [QUERY_KEY, channelId],
    enabled: Boolean(channelId),
    queryFn: async () => {
      if (!channelId) return null
      return await ChannelService.getChannelUserPermissions(channelId)
    },
  })

  const invalidateChannelDetail = () => {
    if (!channelId) return
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY, channelId],
    })
  }

  return {
    channelUserPermissions,
    isLoading,
    isError,
    error,
    isFetching,
    invalidateChannelDetail,
  }
}
