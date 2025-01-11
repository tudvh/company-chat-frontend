import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { ROUTES } from '@/configs'
import { useLoading } from '@/contexts'
import { displayError } from '@/helpers'
import { ChannelRoleService } from '@/services/api'
import { TChannelRoleDetail } from '@/types'
import { ChannelRoleGeneral } from './ChannelRoleGeneral'
import { ChannelRolePermission } from './ChannelRolePermission'
import { ChannelRoleUser } from './ChannelRoleUser'

export const UpdateChannelRolePage = () => {
  const [channelRole, setChannelRole] = useState<TChannelRoleDetail>()
  const { channelId, channelRoleId } = useParams()
  const { showLoading, hideLoading } = useLoading()

  const getChannelRole = async () => {
    if (!channelRoleId) return
    try {
      showLoading()
      const data = await ChannelRoleService.getById(channelRoleId)
      setChannelRole(data)
    } catch (err: any) {
      displayError(err)
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    if (!channelRoleId) return
    getChannelRole()
  }, [channelRoleId])

  if (!channelId || !channelRole) return null

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link to={ROUTES.CHANNEL_SETTING.ROLE.INDEX.replace(':channelId', channelId)}>
          <ChevronLeft />
        </Link>
        <h1 className="text-xl font-bold">Cập nhật vai trò - {channelRole?.name}</h1>
      </div>
      <div>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Tổng quan</TabsTrigger>
            <TabsTrigger value="permission">Quyền hạn</TabsTrigger>
            <TabsTrigger value="member">Thành viên</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ChannelRoleGeneral channelRole={channelRole} />
          </TabsContent>
          <TabsContent value="permission">
            <ChannelRolePermission channelRole={channelRole} />
          </TabsContent>
          <TabsContent value="member">
            <ChannelRoleUser />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
