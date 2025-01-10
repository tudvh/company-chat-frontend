import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui'
import { ROUTES } from '@/configs'

export const ChannelSettingRolePage = () => {
  const { channelId } = useParams()

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
        <p className="font-bold">Danh sách vài trò - 0</p>
      </div>
    </div>
  )
}
