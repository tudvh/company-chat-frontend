import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { LoadingOverlay } from '@/components/ui'
import { LayoutProps } from '@/types'

type TLoadingContext = {
  isLoading: boolean | undefined
  openLoading: () => void
  closeLoading: () => void
}

const LoadingContext = createContext<TLoadingContext | undefined>(undefined)

export const useLoading = (): TLoadingContext => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within an LoadingProvider')
  }
  return context
}

export const LoadingProvider = (props: LayoutProps) => {
  const { children } = props
  const [isLoading, setIsLoading] = useState(false)
  const htmlRef = useRef<HTMLHtmlElement | null>(null)

  const valueLoading = useMemo(
    () => ({
      isLoading,
      openLoading: () => setIsLoading(true),
      closeLoading: () => setIsLoading(false),
    }),
    [isLoading],
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      htmlRef.current = document.querySelector('html')
    }
  }, [])

  useEffect(() => {
    if (htmlRef.current) {
      htmlRef.current.style.pointerEvents = isLoading ? 'none' : 'auto'
      htmlRef.current.style.userSelect = isLoading ? 'none' : 'auto'
    }
  }, [isLoading])

  return (
    <LoadingContext.Provider value={valueLoading}>
      {children}
      <LoadingOverlay open={isLoading} />
    </LoadingContext.Provider>
  )
}
