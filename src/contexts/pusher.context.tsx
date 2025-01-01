import Pusher, { Channel } from 'pusher-js'
import { createContext, useContext, useMemo } from 'react'

import { getEnv } from '@/helpers'
import { LayoutProps } from '@/types'
import { AuthTokenUtil } from '@/utils'

type PusherContextType = {
  subscribeToChannel: (channelName: string) => Channel
  bindEventToChannel: (channel: Channel, eventName: string, callback: (data: any) => void) => void
  unsubscribeFromChannel: (channelName: string) => void
}

const PusherContext = createContext<PusherContextType | undefined>(undefined)

export const usePusher = (): PusherContextType => {
  const context = useContext(PusherContext)
  if (context === undefined) {
    throw new Error('usePusher must be used within a PusherProvider')
  }
  return context
}

export const PusherProvider = ({ children }: LayoutProps) => {
  const { accessToken } = AuthTokenUtil.retrieveTokenData()

  const pusherInstance: Pusher = useMemo(() => {
    return new Pusher(getEnv('VITE_PUSHER_APP_KEY'), {
      cluster: getEnv('VITE_PUSHER_APP_CLUSTER'),
      authEndpoint: `${getEnv('VITE_APP_API_URL')}/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    })
  }, [accessToken])

  const subscribeToChannel = (channelName: string): Channel => {
    const newChannel = pusherInstance.subscribe(channelName)
    return newChannel
  }

  const unsubscribeFromChannel = (channelName: string): void => {
    pusherInstance.unsubscribe(channelName)
  }

  const bindEventToChannel = (
    channel: Channel,
    eventName: string,
    callback: (data: any) => void,
  ): void => {
    channel.bind(eventName, callback)
  }

  const contextValue: PusherContextType = {
    subscribeToChannel,
    bindEventToChannel,
    unsubscribeFromChannel,
  }

  return <PusherContext.Provider value={contextValue}>{children}</PusherContext.Provider>
}
