import { ChevronLeft, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import {
  Button,
  Input,
  Label,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { ROUTES } from '@/configs'
import { UserAvatarDefault } from '@/assets/images'

export const CreateChannelSettingRolePage = () => {
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
            <TabsTrigger value="permission">Quyền hạn</TabsTrigger>
            <TabsTrigger value="member">Thành viên</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="px-2 py-5">
              <div>
                <Label required>Tên vai trò</Label>
                <Input placeholder="Nhập tên vai trò" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="permission">
            <div className="flex justify-between border-b px-2 py-5">
              <p>Gửi tin nhắn</p>
              <Switch />
            </div>
            <div className="flex justify-between border-b px-2 py-5">
              <p>Mời người khác vào máy chủ</p>
              <Switch />
            </div>
            <div className="flex justify-between border-b px-2 py-5">
              <p>Tạo các kênh</p>
              <Switch />
            </div>
          </TabsContent>
          <TabsContent value="member">
            <div className="px-2 py-5">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={UserAvatarDefault}
                    alt=""
                    className="aspect-square size-10 rounded-full object-contain"
                  />
                  <p className="flex-1">Đặng Văn Hoài Tú</p>
                  <Button
                    onClick={() => {}}
                    className="flex size-6 items-center justify-center rounded-full p-0"
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
