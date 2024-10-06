import { LayoutProps } from '@/types'
import { createContext, useContext, useEffect, useMemo } from 'react'
import Pusher from 'pusher-js'
import { getEnv } from '@/helpers'
import { ToastUtil } from '@/utils'
ToastUtil.success('mới dô context')

type TPusherContext = {
  joinChannel: () => void
}

const PusherContext = createContext<TPusherContext | undefined>(undefined)

export const usePusher = (): TPusherContext => {
  const context = useContext(PusherContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const PuhserProvider = (props: LayoutProps) => {
  const { children } = props
  console.warn('vao day')
  try {
    const pusher = useMemo(() => {
      return new Pusher(getEnv('VITE_PUSHER_APP_KEY'), {
        cluster: getEnv('VITE_PUSHER_APP_CLUSTER'),
      })
    }, [])
    console.warn({ VITE_PUSHER_APP_KEY: getEnv('VITE_PUSHER_APP_KEY') })
    console.warn({ VITE_PUSHER_APP_CLUSTER: getEnv('VITE_PUSHER_APP_CLUSTER') })

    useEffect(() => {
      const channel = pusher.subscribe('toanf')
      channel.bind('toanf', function (data: any) {
        console.warn(JSON.stringify(data))
        ToastUtil.success(JSON.stringify(data))
      })

      return () => {
        pusher.unsubscribe('toanf')
      }
    }, [])
  } catch (e) {
    console.warn(e)
  }

  const joinChannel = () => {
    const a: number = 1
    console.warn(a)
  }

  const contextValue: TPusherContext = {
    joinChannel,
  }

  return <PusherContext.Provider value={contextValue}>{children}</PusherContext.Provider>
}
