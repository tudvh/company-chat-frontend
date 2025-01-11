import { ChevronDown, Settings, SquarePlus, UserRoundPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { LeaveIcon } from '@/components/icons'
import {
  AppDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'
import { ROUTES } from '@/configs'
import { useAuth, useLoading } from '@/contexts'
import { PermissionEnum } from '@/enums'
import { displayError } from '@/helpers'
import { useChannelDetail, useChannels, useChannelUserPermissions } from '@/hooks'
import { cn } from '@/lib/utils'
import { ChannelService } from '@/services/api'
import { TChannelDetail } from '@/types'
import { AlertUtil, ToastUtil } from '@/utils'
import { GroupCreate } from './group-create'
import { InviteCreate } from './invite-create'

interface MenuDropdownProps {
  channel: TChannelDetail
}

export const MenuDropdown = ({ channel }: MenuDropdownProps) => {
  const { showLoading, hideLoading } = useLoading()
  const { channelId } = useParams()
  const { userProfile } = useAuth()
  const { invalidateChannels } = useChannels(userProfile?.id)
  const { channelDetail } = useChannelDetail(channelId)
  const { channelUserPermissions } = useChannelUserPermissions(channelId)
  const [isModalInviteOpen, setModalInviteOpen] = useState(false)
  const [isModalGroupOpen, setModalGroupOpen] = useState(false)
  const navigate = useNavigate()

  const hasCreateRoomPermission = useMemo(() => {
    if (channelDetail?.isCreator) return true
    return channelUserPermissions?.includes(PermissionEnum.CreateRoom)
  }, [channelUserPermissions, channelDetail])

  const hasInvitePermission = useMemo(() => {
    if (channelDetail?.isCreator) return true
    return channelUserPermissions?.includes(PermissionEnum.Invite)
  }, [channelUserPermissions, channelDetail])

  const hasSettingChannelPermission = useMemo(() => {
    if (channelDetail?.isCreator) return true
    return channelUserPermissions?.includes(PermissionEnum.SettingChannel)
  }, [channelUserPermissions, channelDetail])

  const confirmLeaveChannel = async () => {
    const result = await AlertUtil.confirm({
      title: 'Rời khỏi máy chủ',
      text: 'Bạn có chắc chắn muốn rời khỏi máy chủ này?',
    })
    if (result) {
      leaveChannel()
    }
  }

  const leaveChannel = async () => {
    try {
      showLoading()
      await ChannelService.leaveChannel(channel.id)
      ToastUtil.success('Rời khỏi máy chủ thành công')
      invalidateChannels()
      navigate(ROUTES.HOME)
    } catch (error) {
      displayError(error, {
        title: 'Rời khỏi máy chủ thất bại',
      })
    } finally {
      hideLoading()
    }
  }

  const DROPDOWN_ITEMS = [
    {
      id: 1,
      label: 'Mời mọi người',
      icon: UserRoundPlus,
      onClick: () => setModalInviteOpen(true),
      type: 'button',
      isShow: hasInvitePermission,
    },
    {
      id: 2,
      label: 'Cài đặt máy chủ',
      icon: Settings,
      to: ROUTES.CHANNEL_SETTING.INDEX.replace(':channelId', channel.id),
      type: 'link',
      isShow: hasSettingChannelPermission,
    },
    {
      id: 3,
      label: 'Tạo danh mục',
      icon: SquarePlus,
      onClick: () => {
        setModalGroupOpen(true)
      },
      type: 'button',
      isShow: hasCreateRoomPermission,
    },
    {
      id: 4,
      label: 'Rời khỏi máy chủ',
      icon: LeaveIcon,
      onClick: confirmLeaveChannel,
      type: 'button',
      variant: 'destructive',
      isShow: true,
    },
  ]

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-12 w-full items-center justify-between gap-3 border-b px-4 font-bold">
            <h1 className="line-clamp-1 flex-1 break-all text-left">{channel.name}</h1>
            <ChevronDown className="size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {DROPDOWN_ITEMS.filter(item => item.isShow).map(item => {
            const Icon = item.icon
            const className = cn(
              'flex w-full cursor-pointer items-center justify-between',
              item.variant === 'destructive' &&
                'text-destructive focus:bg-destructive focus:text-white',
            )
            if (item.type === 'link') {
              return (
                <DropdownMenuItem key={item.id} className={className} asChild>
                  <Link to={item.to ?? '#'}>
                    <span>{item.label}</span>
                    <Icon className="h-4" />
                  </Link>
                </DropdownMenuItem>
              )
            }
            return (
              <DropdownMenuItem key={item.id} className={className} onClick={item.onClick}>
                <span>{item.label}</span>
                <Icon className="h-4" />
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <AppDialog
        open={isModalInviteOpen}
        onOpenChange={setModalInviteOpen}
        title={`Mời bạn bè vào ${channel.name}`}
        description="Chia sẻ link cho người khác để cấp quyền truy cập vào kênh"
        isStatic
      >
        <InviteCreate
          isModalOpen={isModalInviteOpen}
          channelId={channel.id}
          onClose={() => setModalInviteOpen(false)}
        />
      </AppDialog>
      <AppDialog
        open={isModalGroupOpen}
        onOpenChange={setModalGroupOpen}
        title="Tạo danh mục"
        description="Tạo danh mục để quản lý các kênh của bạn"
        isStatic
      >
        <GroupCreate
          isModalOpen={isModalGroupOpen}
          channelId={channel.id}
          onClose={() => setModalGroupOpen(false)}
        />
      </AppDialog>
    </>
  )
}
