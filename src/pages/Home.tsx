import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { useAuth } from '@/contexts'
import { displayError } from '@/helpers'
import { useChannels } from '@/hooks'

export const HomePage = () => {
  const { userProfile } = useAuth()
  const { channels, error: channelsError } = useChannels(userProfile?.id)
  const navigate = useNavigate()

  useEffect(() => {
    if (channelsError) {
      displayError(channelsError)
      console.error('Error fetching my channels:', channelsError)
    }
  }, [channelsError])

  useEffect(() => {
    if (!channels) return
    const channelId = channels[0]?.id
    navigate(ROUTES.CHANNEL.replace(':channelId', channelId))
  }, [channels])

  return null
}
