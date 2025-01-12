import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { UserAvatarDefault } from '@/assets/images'
import { Button } from '@/components/ui'
import { useLoading } from '@/contexts'
import { displayError } from '@/helpers'
import { ChannelService } from '@/services/api'
import { TRoleUser } from '@/types'
import { AlertUtil, ToastUtil } from '@/utils'

export const ChannelSettingUserPage = () => {
  const { channelId } = useParams()
  const { showLoading, hideLoading } = useLoading()
  const [channelUsers, setChannelUsers] = useState<TRoleUser[]>([])

  const getChannelUsers = async () => {
    if (!channelId) return
    showLoading()
    try {
      const data = await ChannelService.getChannelUsers(channelId)
      setChannelUsers(data)
    } catch (err: any) {
      displayError(err)
    } finally {
      hideLoading()
    }
  }

  const confirmRemoveUser = async (userId: string) => {
    if (!channelId) return
    const result = await AlertUtil.confirm({
      title: 'Bạn có chắc muốn loại bỏ người dùng này ra khỏi máy chủ của bạn không?',
    })
    if (!result) return
    try {
      showLoading()
      await ChannelService.removeUser(channelId, userId)
      ToastUtil.success('Loại bỏ người dùng thành công')
      getChannelUsers()
    } catch (err) {
      displayError(err)
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    if (!channelId) return
    getChannelUsers()
  }, [channelId])

  return (
    <>
      <h1 className="mb-6 text-xl font-bold">Người dùng trong máy chủ</h1>
      <div className="space-y-5">
        {channelUsers.map(user => (
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl || UserAvatarDefault}
              alt=""
              className="aspect-square size-10 rounded-full object-contain"
            />
            <p className="flex-1">{user.fullName}</p>
            {!user.isCreator && (
              <Button
                onClick={() => {
                  confirmRemoveUser(user.id)
                }}
                variant="destructive"
                className="flex size-6 items-center justify-center rounded-full p-0"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
