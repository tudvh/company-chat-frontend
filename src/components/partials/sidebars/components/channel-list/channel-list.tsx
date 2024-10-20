import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { AppLogo } from '@/assets/images'
import { AppDialog, AppTooltip } from '@/components/ui'
import { ROUTES } from '@/configs'
import { useAuth } from '@/contexts'
import { displayError } from '@/helpers'
import { useMyChannels } from '@/hooks'
import { cn } from '@/lib/utils'
import { ChannelCreate } from './channel-create'

export const ChannelList = () => {
  const { userProfile } = useAuth()
  const { channelId } = useParams()
  const { data: myChannels, error: myChannelsError } = useMyChannels(userProfile?.id)
  const [isModalOpen, setModalOpen] = useState(false)
  const location = useLocation()
  const pathName = location.pathname

  useEffect(() => {
    if (myChannelsError) {
      displayError(myChannelsError)
      console.error('Error fetching my channels:', myChannelsError)
    }
  }, [myChannelsError])

  return (
    <div className="thread-scroll h-full overflow-y-auto bg-primary/10 py-3 pr-2">
      <div className="flex flex-col gap-3 overflow-hidden">
        {/* Home button */}
        <div className="flex gap-1.5">
          <div
            className={cn(
              'h-12 w-1 rounded-br-lg rounded-tr-lg',
              pathName === ROUTES.HOME ? 'bg-primary' : 'bg-transparent',
            )}
          />
          <AppTooltip position="right" content="Tin nhắn trực tiếp" asChild>
            <Link
              to={ROUTES.HOME}
              className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-background p-2 transition duration-200 hover:rounded-xl active:translate-y-0.5"
            >
              <img src={AppLogo} className="aspect-square size-full object-cover" alt="" />
            </Link>
          </AppTooltip>
        </div>
        <div className="ml-3 h-0.5 w-full rounded-full bg-primary" />
        {/* List of channels */}
        {myChannels?.map(channel => (
          <div className="flex gap-1.5">
            <div
              className={cn(
                'h-12 w-1 rounded-br-lg rounded-tr-lg',
                channelId === channel.id ? 'bg-primary' : 'bg-transparent',
              )}
            />
            <AppTooltip key={channel.id} position="right" content={channel.name} asChild>
              <Link
                to={ROUTES.CHANNEL.replace(':channelId', channel.id)}
                className="size-12 overflow-hidden rounded-full transition duration-200 hover:rounded-xl active:translate-y-0.5"
              >
                {channel.thumbnailUrl ? (
                  <img
                    src={channel.thumbnailUrl}
                    className="block aspect-square size-full object-cover"
                    alt={`${channel.name} thumbnail`}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-background">
                    <p>{channel.name.charAt(0).toUpperCase()}</p>
                  </div>
                )}
              </Link>
            </AppTooltip>
          </div>
        ))}
        {/* Add new channel button */}
        <AppTooltip position="right" content="Thêm máy chủ" asChild>
          <div className="flex gap-1.5">
            <div className="h-12 w-1 bg-transparent" />
            <button
              className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-background p-2 text-green-600 transition duration-200 hover:rounded-xl active:translate-y-0.5"
              onClick={() => setModalOpen(true)}
            >
              <Plus size={24} />
            </button>
          </div>
        </AppTooltip>
        <AppDialog
          open={isModalOpen}
          onOpenChange={setModalOpen}
          title="Khởi tạo máy chủ mới"
          description="Chọn một cái tên độc đáo và ấn tượng cho máy chủ mới của bạn – đừng lo, bạn luôn có thể thay đổi nó sau!"
          onClose={() => setModalOpen(false)}
          isStatic
        >
          <ChannelCreate isModalOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </AppDialog>
      </div>
    </div>
  )
}
