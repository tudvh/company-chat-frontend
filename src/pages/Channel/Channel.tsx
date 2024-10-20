import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { displayError, getDefaultRoomId } from '@/helpers'
import { useMyChannelDetail } from '@/hooks'

export const ChannelPage = () => {
  const { channelId } = useParams()
  const { data: myChannelDetail, error: myChannelDetailError } = useMyChannelDetail(channelId)
  const navigate = useNavigate()

  useEffect(() => {
    if (channelId && myChannelDetail) {
      const roomId = getDefaultRoomId(myChannelDetail)
      if (!roomId) {
        navigate(ROUTES.HOME)
        return
      }
      navigate(ROUTES.ROOM.replace(':channelId', channelId).replace(':roomId', roomId))
    }
  }, [channelId, myChannelDetail])

  useEffect(() => {
    if (myChannelDetailError) {
      displayError(myChannelDetailError)
      console.error('Error fetching my channel detail:', myChannelDetailError)
      navigate(ROUTES.HOME)
    }
  }, [myChannelDetailError])

  return null
}
