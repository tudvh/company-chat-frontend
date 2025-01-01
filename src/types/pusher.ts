import { UID } from 'agora-rtc-react'

import { TMessageUser } from './user'

export type TPusherEventMember = {
  id: UID
  info: TMessageUser
}
