import { SendIcon } from 'lucide-react'

import { UserAvatarDefault } from '@/assets/images'
import { SharpIcon } from '@/components/icons'
import { Button, Input } from '@/components/ui'
import { TRoom } from '@/types'

interface ChatRoomPageProps {
  room: TRoom
}

export const ChatRoomPage = ({ room }: ChatRoomPageProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 w-full items-center justify-between gap-3 border-b px-4 font-bold">
        <SharpIcon className="size-5 text-muted-foreground" />
        <h1 className="line-clamp-1 flex-1 text-left">{room.name}</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-full flex-col justify-end gap-8 pl-4 pr-1 pt-4">
          <div className="space-y-2">
            <div className="flex size-16 p-3 items-center justify-center rounded-full bg-primary">
              <SharpIcon className="text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold line-clamp-1 break-all">Chào mừng bạn đến với #{room.name}!</h1>
          </div>
          <div className="flex flex-col-reverse gap-5">
            <div className="flex items-start gap-4">
              <img src={UserAvatarDefault} className="aspect-square size-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <h3 className="font-bold flex items-center gap-2">
                  <span>Tú Đặng</span>
                  <span className='font-normal text-xs'>16:15 27/10/2024</span>
                </h3>
                <p>Hello, chào mừng các bạn đã đến với channel của mình</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <img src={UserAvatarDefault} className="aspect-square size-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <h3 className="font-bold flex items-center gap-2">
                  <span>Tú Đặng</span>
                  <span className='font-normal text-xs'>16:15 27/10/2024</span>
                </h3>
                <p>Hello, chào mừng các bạn đã đến với channel của mình</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <img src={UserAvatarDefault} className="aspect-square size-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <h3 className="font-bold flex items-center gap-2">
                  <span>Tú Đặng</span>
                  <span className='font-normal text-xs'>16:15 27/10/2024</span>
                </h3>
                <p>Hello, chào mừng các bạn đã đến với channel của mình Hello, chào mừng các bạn đã đến với channel của mình Hello, chào mừng các bạn đã đến với channel của mình</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 pb-10">
        <div className="flex h-11 items-center justify-center gap-4">
          <Input className="flex-1 rounded-sm bg-muted text-base focus-visible:ring-0 focus-visible:ring-offset-0" />
          <Button className="">
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
