import Pusher, { Channel } from 'pusher-js'
import { createContext, useContext, useMemo, useState } from 'react'

import { getEnv } from '@/helpers'
import { LayoutProps } from '@/types'
import { AuthTokenUtil } from '@/utils'

type PusherContextType = {
  socketId: string | undefined
  subscribeToChannel: (channelName: string) => Channel
  bindEventToChannel: (
    channelName: string,
    eventName: string,
    callback: (data: any) => void,
  ) => void
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
  const [channels, setChannels] = useState<Channel[]>([])
  const [socketId, setSocketId] = useState<string>()
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
  }, [])

  const subscribeToChannel = (channelName: string): Channel => {
    const newChannel = pusherInstance.subscribe(channelName)
    setChannels(prevChannels => [...prevChannels, newChannel])
    setSocketId(pusherInstance.connection.socket_id)
    return newChannel
  }

  const getChannel = (channelName: string): Channel => {
    const channel = channels.find(channel => {
      return channel.name === channelName
    })
    if (!channel) {
      throw new Error(`Channel not found: ${channelName}`)
    }
    return channel
  }

  const unsubscribeFromChannel = (channelName: string): void => {
    pusherInstance.unsubscribe(channelName)
    setChannels(prevChannels => prevChannels.filter(channel => channel.name !== channelName))
    setSocketId(undefined)
  }

  const bindEventToChannel = (
    channelName: string,
    eventName: string,
    callback: (data: any) => void,
  ): void => {
    const channel = getChannel(channelName)
    channel.bind(eventName, callback)
  }

  const contextValue: PusherContextType = {
    socketId,
    subscribeToChannel,
    bindEventToChannel,
    unsubscribeFromChannel,
  }

  return <PusherContext.Provider value={contextValue}>{children}</PusherContext.Provider>
}
