import { useEffect, useState } from 'react'

import { Button, Switch } from '@/components/ui'
import { useLoading } from '@/contexts'
import { PermissionEnum } from '@/enums'
import { displayError } from '@/helpers'
import { ChannelRoleService } from '@/services/api'
import { TChannelRoleDetail } from '@/types'
import { ToastUtil } from '@/utils'

interface ChannelRolePermissionProps {
  channelRole: TChannelRoleDetail
}

export const ChannelRolePermission = ({ channelRole }: ChannelRolePermissionProps) => {
  const { showLoading, hideLoading } = useLoading()
  const [permissions, setPermissions] = useState<PermissionEnum[]>([])

  const getPermissions = async () => {
    try {
      showLoading()
      const data = await ChannelRoleService.getPermissions(channelRole.id)
      setPermissions(data)
    } catch (err: any) {
      displayError(err)
    } finally {
      hideLoading()
    }
  }

  const handleSetPermissions = (permission: PermissionEnum, isSet: boolean) => {
    if (isSet) {
      setPermissions([...permissions, permission])
    } else {
      setPermissions(permissions.filter(p => p !== permission))
    }
  }

  const onSubmit = async () => {
    try {
      showLoading()
      await ChannelRoleService.updatePermissions(channelRole.id, {
        permissions,
      })
      ToastUtil.success('Cập nhật thành công')
    } catch (err: any) {
      displayError(err)
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    getPermissions()
  }, [channelRole.id])

  return (
    <div className="px-2">
      <div className="flex justify-between border-b py-5">
        <p>Cài đặt máy chủ</p>
        <Switch
          checked={permissions.includes(PermissionEnum.SettingChannel)}
          onCheckedChange={isSet => handleSetPermissions(PermissionEnum.SettingChannel, isSet)}
        />
      </div>
      <div className="flex justify-between border-b py-5">
        <p>Tạo các kênh trong máy chủ</p>
        <Switch
          checked={permissions.includes(PermissionEnum.CreateRoom)}
          onCheckedChange={isSet => handleSetPermissions(PermissionEnum.CreateRoom, isSet)}
        />
      </div>
      <div className="flex justify-between border-b py-5">
        <p>Gửi tin nhắn trong máy chủ</p>
        <Switch
          checked={permissions.includes(PermissionEnum.SendMessage)}
          onCheckedChange={isSet => handleSetPermissions(PermissionEnum.SendMessage, isSet)}
        />
      </div>
      <div className="flex justify-between border-b py-5">
        <p>Mời người khác vào máy chủ</p>
        <Switch
          checked={permissions.includes(PermissionEnum.Invite)}
          onCheckedChange={isSet => handleSetPermissions(PermissionEnum.Invite, isSet)}
        />
      </div>

      <div className="flex justify-end py-5">
        <Button onClick={onSubmit}>Lưu thay đổi</Button>
      </div>
    </div>
  )
}
