import { ROUTES } from '@/configs'
import { useAuth } from '@/contexts'
import { useChannels } from '@/hooks'
import { ChannelService } from '@/services/api'
import { ToastUtil } from '@/utils'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const JoinChannel = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const { invalidateChannels } = useChannels(userProfile?.id)

  const joinChannel = async (code: string) => {
    const channel = await ChannelService.joinChannel(code)

    if (!channel) {
      return navigate(ROUTES.HOME)
    }
    invalidateChannels()
    ToastUtil.success('Tham gia máy chủ thành công')
    navigate(ROUTES.CHANNEL.replace(':channelId', channel.id))
  }

  useEffect(() => {
    if (code) {
      joinChannel(code)
    } else {
      navigate(ROUTES.HOME)
    }
  }, [])
  return <>{code}</>
}
