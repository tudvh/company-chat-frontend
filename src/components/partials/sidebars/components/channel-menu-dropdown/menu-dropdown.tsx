import {
  AppDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'
import { ChevronDown } from 'lucide-react'
import { InviteCreate } from './invite-create'
import { useState } from 'react'
import { TChannelDetail } from '@/types'

interface MenuDropdownProps {
  channel: TChannelDetail
}

export const MenuDropdown = ({ channel }: MenuDropdownProps) => {
  const [isModalInviteOpen, setModalInviteOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-12 w-full items-center justify-between gap-3 border-b px-4 font-bold">
            <h1 className="line-clamp-1 flex-1 text-left">toanf</h1>
            <ChevronDown className="size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background p-3">
          <DropdownMenuItem className="cursor-pointer" onClick={() => setModalInviteOpen(true)}>
            <button>Mời mọi người</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AppDialog
        open={isModalInviteOpen}
        onOpenChange={setModalInviteOpen}
        title={`Mời bạn bè vào ${channel.name}`}
        description="Chọn một cái tên độc đáo và ấn tượng cho máy chủ mới của bạn – đừng lo, bạn luôn có thể thay đổi nó sau!"
        onClose={() => setModalInviteOpen(false)}
        isStatic
      >
        <InviteCreate
          channel={channel}
          isModalOpen={isModalInviteOpen}
          onClose={() => setModalInviteOpen(false)}
        />
      </AppDialog>
    </>
  )
}
