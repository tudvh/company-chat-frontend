import { X } from 'lucide-react'
import { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { displayError } from '@/helpers'
import { useChannelDetail } from '@/hooks'
import { ChannelSettingSidebar } from '../partials/sidebars'
import { ProtectedPageProvider } from '../providers'
import { Button } from '../ui'

export const ChannelSettingLayout = () => {
  const { channelId } = useParams()
  const { channelDetail, error: channelDetailError } = useChannelDetail(channelId)
  const navigate = useNavigate()

  const handleBack = () => {
    if (!channelDetail) return
    navigate(ROUTES.CHANNEL.replace(':channelId', channelDetail.id))
  }

  useEffect(() => {
    if (channelDetailError) {
      displayError(channelDetailError)
      console.error('Error fetching my channel detail:', channelDetailError)
      navigate(ROUTES.HOME)
    }
  }, [channelDetailError])

  if (!channelDetail) return null

  return (
    <ProtectedPageProvider>
      <div className="mx-auto flex h-dvh max-w-screen-lg px-5 pt-10">
        <ChannelSettingSidebar channelDetail={channelDetail} />
        <div className="flex-1">
          <Outlet />
        </div>
        <Button variant="outline" className="size-10 rounded-full p-2" onClick={handleBack}>
          <X />
        </Button>
      </div>
    </ProtectedPageProvider>
  )
}
