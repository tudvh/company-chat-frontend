import { Link, useLocation } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { TChannelDetail } from '@/types'
import { cn } from '@/lib/utils'

interface ChannelSettingSidebarProps {
  channelDetail: TChannelDetail
}

export const ChannelSettingSidebar = ({ channelDetail }: ChannelSettingSidebarProps) => {
  const location = useLocation()

  const SETTING_ITEMS = [
    {
      id: '1',
      label: 'Tổng quan',
      to: ROUTES.CHANNEL_SETTING.INDEX.replace(':channelId', channelDetail.id),
      type: 'link',
    },
    {
      id: '2',
      label: 'Vai trò',
      to: ROUTES.CHANNEL_SETTING.ROLE.INDEX.replace(':channelId', channelDetail.id),
      type: 'link',
    },
  ]

  return (
    <aside className="h-full w-[200px] overflow-y-scroll">
      <h1 className="px-3 py-2 text-xs font-bold uppercase">{channelDetail.name}</h1>
      <ul className="space-y-1">
        {SETTING_ITEMS.map(item => (
          <li key={item.id}>
            <Link
              to={item.to}
              className={cn(
                'block w-full rounded-lg px-3 py-2 text-sm hover:bg-muted',
                location.pathname.includes(item.to) && 'bg-muted',
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
