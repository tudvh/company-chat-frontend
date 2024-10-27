import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { displayError, getDefaultRoomId } from '@/helpers'
import { useChannelDetail } from '@/hooks'

export const ChannelPage = () => {
  const { channelId } = useParams()
  const { channelDetail, error: channelDetailError } = useChannelDetail(channelId)
  const navigate = useNavigate()

  useEffect(() => {
    if (channelId && channelDetail) {
      const roomId = getDefaultRoomId(channelDetail)
      if (!roomId) {
        navigate(ROUTES.HOME)
        return
      }
      navigate(ROUTES.ROOM.replace(':channelId', channelId).replace(':roomId', roomId))
    }
  }, [channelId, channelDetail])

  useEffect(() => {
    if (channelDetailError) {
      displayError(channelDetailError)
      console.error('Error fetching my channel detail:', channelDetailError)
      navigate(ROUTES.HOME)
    }
  }, [channelDetailError])

  return null
}
