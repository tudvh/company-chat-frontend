import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { useAuth, useLoading } from '@/contexts'
import { displayError } from '@/helpers'
import { useChannels } from '@/hooks'
import { ChannelService } from '@/services/api'
import { JoinChannelPayload } from '@/types'
import { AlertUtil, ToastUtil } from '@/utils'

export const JoinChannel = () => {
  const { code } = useParams()
  const { showLoading, hideLoading } = useLoading()
  const { userProfile } = useAuth()
  const { prependChannel } = useChannels(userProfile?.id)
  const navigate = useNavigate()

  const confirmJoinChannel = async (code: string) => {
    const result = await AlertUtil.confirm({
      title: 'Tham gia máy chủ',
      text: 'Bạn có chắc chắn muốn tham gia máy chủ này?',
    })
    if (result) {
      joinChannel(code)
    } else {
      navigate(ROUTES.HOME)
    }
  }

  const joinChannel = async (code: string) => {
    try {
      showLoading()
      const payload: JoinChannelPayload = {
        code,
      }
      const channel = await ChannelService.joinChannel(payload)
      prependChannel(channel)
      ToastUtil.success('Tham gia máy chủ thành công')
      navigate(ROUTES.CHANNEL.replace(':channelId', channel.id))
    } catch (error) {
      displayError(error, {
        title: 'Lỗi khi tham gia máy chủ',
      })
      navigate(ROUTES.HOME)
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    if (!code) {
      navigate(ROUTES.HOME)
      return
    }
    confirmJoinChannel(code)
  }, [])

  return null
}
