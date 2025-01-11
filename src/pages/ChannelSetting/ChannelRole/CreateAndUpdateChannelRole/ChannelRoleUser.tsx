import { Plus, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { UserAvatarDefault } from '@/assets/images'
import { Button } from '@/components/ui'
import { useLoading } from '@/contexts'
import { displayError } from '@/helpers'
import { ChannelRoleService, ChannelService } from '@/services/api'
import { TRoleUser } from '@/types'

export const ChannelRoleUser = () => {
  const { channelId, channelRoleId } = useParams()
  const { showLoading, hideLoading } = useLoading()
  const [channelUsers, setChannelUsers] = useState<TRoleUser[]>([])
  const [channelRoleUserIds, setChannelRoleUserIds] = useState<string[]>([])

  const [availableChannelUsers, channelRoleUsers] = useMemo(() => {
    if (!channelUsers?.length) return [[], []]

    const channelRoleUsers = channelUsers.filter(user => channelRoleUserIds?.includes(user.id))
    const availableChannelUsers = channelUsers.filter(
      user => !channelRoleUserIds?.includes(user.id),
    )

    return [availableChannelUsers, channelRoleUsers]
  }, [channelUsers, channelRoleUserIds])

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

  const getChannelRoleUsers = async () => {
    if (!channelRoleId) return
    showLoading()
    try {
      const data = await ChannelRoleService.getUsers(channelRoleId)
      setChannelRoleUserIds(data)
    } catch (err: any) {
      displayError(err)
    } finally {
      hideLoading()
    }
  }

  const handleAddUser = async (userId: string) => {
    if (!channelRoleId) return
    await ChannelRoleService.addUsers(channelRoleId, userId)
    setChannelRoleUserIds(prev => [...prev, userId])
  }

  const handleRemoveUser = async (userId: string) => {
    if (!channelRoleId) return
    await ChannelRoleService.removeUsers(channelRoleId, userId)
    setChannelRoleUserIds(prev => prev.filter(id => id !== userId))
  }

  useEffect(() => {
    if (!channelId) return
    getChannelUsers()
  }, [channelId])

  useEffect(() => {
    if (!getChannelRoleUsers) return
    getChannelRoleUsers()
  }, [channelRoleId])

  if (!channelId || !channelRoleId) return null

  return (
    <div className="px-2 py-5">
      <div className="space-y-5">
        <div className="space-y-5">
          {channelRoleUsers.length
            ? channelRoleUsers.map(user => (
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl || UserAvatarDefault}
                    alt=""
                    className="aspect-square size-10 rounded-full object-contain"
                  />
                  <p className="flex-1">{user.fullName}</p>
                  <Button
                    onClick={() => {
                      handleRemoveUser(user.id)
                    }}
                    className="flex size-6 items-center justify-center rounded-full p-0"
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))
            : 'Không có thành viên nào'}
        </div>
        <hr />
        <div className="space-y-5">
          {availableChannelUsers.map(user => (
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || UserAvatarDefault}
                alt=""
                className="aspect-square size-10 rounded-full object-contain"
              />
              <p className="flex-1">{user.fullName}</p>
              <Button
                onClick={() => {
                  handleAddUser(user.id)
                }}
                variant="outline"
                className="flex size-6 items-center justify-center rounded-full p-0"
              >
                <Plus className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
