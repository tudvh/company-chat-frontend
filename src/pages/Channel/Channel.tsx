import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { displayError, getDefaultRoomId } from '@/helpers'
import { useJointedChannelDetail } from '@/hooks'

export const ChannelPage = () => {
  const { channelId } = useParams()
  const { data: jointedChannelDetail, error: myChannelDetailError } =
    useJointedChannelDetail(channelId)
  const navigate = useNavigate()

  useEffect(() => {
    if (channelId && jointedChannelDetail) {
      const roomId = getDefaultRoomId(jointedChannelDetail)
      if (!roomId) {
        navigate(ROUTES.HOME)
        return
      }
      navigate(ROUTES.ROOM.replace(':channelId', channelId).replace(':roomId', roomId))
    }
  }, [channelId, jointedChannelDetail])

  useEffect(() => {
    if (myChannelDetailError) {
      displayError(myChannelDetailError)
      console.error('Error fetching my channel detail:', myChannelDetailError)
      navigate(ROUTES.HOME)
    }
  }, [myChannelDetailError])

  return null
}
