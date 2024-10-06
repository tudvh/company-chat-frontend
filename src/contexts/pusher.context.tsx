import { LayoutProps } from '@/types'
import { createContext, useContext, useEffect, useMemo } from 'react'
import Pusher from 'pusher-js'
import { getEnv } from '@/helpers'

type TPusherContext = {}

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
  console.log('vao day')
  try {
    const pusher = useMemo(() => {
      return new Pusher(getEnv('VITE_PUSHER_APP_KEY'), {
        cluster: getEnv('VITE_PUSHER_APP_CLUSTER'),
      })
    }, [])

    console.log({ VITE_PUSHER_APP_KEY: getEnv('VITE_PUSHER_APP_KEY') })
    console.log({ VITE_PUSHER_APP_CLUSTER: getEnv('VITE_PUSHER_APP_CLUSTER') })

    useEffect(() => {
      const channel = pusher.subscribe('toanf')
      channel.bind('toanf', function (data: any) {
        console.log(JSON.stringify(data))
      })

      return () => {
        pusher.unsubscribe('toanf')
      }
    }, [])
  } catch (e) {
    console.log(e)
  }

  const contextValue: TPusherContext = {}

  return <PusherContext.Provider value={contextValue}>{children}</PusherContext.Provider>
}
