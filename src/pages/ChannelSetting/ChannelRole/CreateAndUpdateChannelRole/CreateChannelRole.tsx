import { ChevronLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { ROUTES } from '@/configs'
import { ChannelRoleGeneral } from './ChannelRoleGeneral'

export const CreateChannelRolePage = () => {
  const { channelId } = useParams()

  if (!channelId) return null

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link to={ROUTES.CHANNEL_SETTING.ROLE.INDEX.replace(':channelId', channelId)}>
          <ChevronLeft />
        </Link>
        <h1 className="text-xl font-bold">Tạo mới vai trò</h1>
      </div>
      <div>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Tổng quan</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ChannelRoleGeneral />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
