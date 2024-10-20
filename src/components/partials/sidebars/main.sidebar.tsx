import { ChannelList, RoomList } from './components'

export const MainSidebar = () => {
  return (
    <aside className="flex h-dvh w-[300px] select-none">
      <ChannelList />
      <RoomList />
    </aside>
  )
}
