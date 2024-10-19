import { ChevronDown, ChevronRight, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SharpIcon } from '@/components/icons/sharp.icon'
import { ChannelList } from './components'

export const MainSidebar = () => {
  return (
    <aside className="flex h-dvh w-[300px] select-none">
      <ChannelList />

      <div className="flex h-full flex-1 flex-col bg-primary/5">
        <button
          className="flex h-12 w-full items-center justify-between gap-3 border-b px-4 font-bold"
          title="Quà Tặng Cột Sống"
        >
          <h1 className="line-clamp-1 flex-1 text-left">Quà Tặng Cột Sống</h1>
          <ChevronDown className="size-5" />
        </button>
        <ul className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-5">
          <div className="space-y-1 font-medium text-muted-foreground">
            <div className="flex gap-1">
              <ChevronRight className="size-3.5" />
              <span className="text-xs uppercase">Kênh chat</span>
            </div>
            <Link
              to="#"
              className="flex items-center gap-2 rounded bg-primary/10 px-2 py-1 text-primary"
            >
              <SharpIcon className="size-5 font-normal text-muted-foreground" />
              <span className="line-clamp-1 flex-1">Chung</span>
            </Link>
            <Link to="#" className="flex items-center gap-2 rounded px-2 py-1 hover:bg-primary/5">
              <SharpIcon className="size-5 font-normal text-muted-foreground" />
              <span className="line-clamp-1 flex-1">Tech</span>
            </Link>
          </div>
          <div className="space-y-1 font-medium text-muted-foreground">
            <div className="flex gap-1">
              <ChevronRight className="size-3.5" />
              <span className="text-xs uppercase">Kênh thoại</span>
            </div>
            <Link
              to="call1"
              className="flex items-center gap-2 rounded bg-primary/10 px-2 py-1 text-primary"
            >
              <Volume2 className="size-5 font-normal text-muted-foreground" />
              <span className="line-clamp-1 flex-1">Chung</span>
            </Link>
            <Link
              to="call1"
              className="flex items-center gap-2 rounded px-2 py-1 hover:bg-primary/5"
            >
              <Volume2 className="size-5 font-normal text-muted-foreground" />
              <span className="line-clamp-1 flex-1">Tech</span>
            </Link>
          </div>
        </ul>
      </div>
    </aside>
  )
}
