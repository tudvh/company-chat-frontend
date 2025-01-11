import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui'
import { ROUTES } from '@/configs'
import { useLoading } from '@/contexts'
import { displayError } from '@/helpers'
import { ChannelRoleService } from '@/services/api'
import { GetChannelRolesRequest, TChannelRole } from '@/types'

export const ChannelSettingRolePage = () => {
  const [channelRoles, setChannelRoles] = useState<TChannelRole[]>([])
  const { showLoading, hideLoading } = useLoading()
  const { channelId } = useParams()
  const navigate = useNavigate()

  const getChannelRoles = async () => {
    if (!channelId) return
    showLoading()
    try {
      const params: GetChannelRolesRequest = {
        channelId,
      }
      const data = await ChannelRoleService.getByChannel(params)
      setChannelRoles(data)
    } catch (err) {
      displayError(err)
    } finally {
      hideLoading()
    }
  }

  const navigateToUpdatePage = (channelRoleId: string) => {
    if (!channelId) return
    navigate(
      ROUTES.CHANNEL_SETTING.ROLE.UPDATE.replace(':channelId', channelId).replace(
        ':channelRoleId',
        channelRoleId,
      ),
    )
  }

  useEffect(() => {
    if (!channelId) return
    getChannelRoles()
  }, [channelId])

  if (!channelId) return null

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Vai trò</h1>
        <p>Sử dụng vai trò để phân nhóm các thành viên máy chủ và chỉ định quyền của họ.</p>
      </div>
      <div className="flex">
        <div className="flex-1"></div>
        <Button asChild>
          <Link to={ROUTES.CHANNEL_SETTING.ROLE.CREATE.replace(':channelId', channelId)}>
            Tạo vai trò
          </Link>
        </Button>
      </div>
      <div>
        <table className="vertical-align-middle w-full text-right">
          <thead>
            <tr>
              <th className="px-2 py-3 text-left">Vai trò - {channelRoles.length}</th>
              <th className="px-2 py-3">Thành viên</th>
            </tr>
          </thead>
          <tbody>
            {channelRoles.map(channelRole => (
              <tr
                key={channelRole.id}
                className="cursor-pointer border-t hover:bg-gray-100"
                onClick={() => navigateToUpdatePage(channelRole.id)}
              >
                <td className="px-2 py-3 text-left">{channelRole.name}</td>
                <td className="px-2 py-3">{channelRole.channelUsersLength}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
