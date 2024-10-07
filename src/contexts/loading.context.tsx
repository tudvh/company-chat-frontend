import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { LoadingOverlay } from '@/components/ui'
import { LayoutProps } from '@/types'

type LoadingContextType = {
  isShowLoading: boolean
  showLoading: () => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export const LoadingProvider = ({ children }: LayoutProps) => {
  const [isShowLoading, setIsShowLoading] = useState(false)
  const htmlElementRef = useRef<HTMLHtmlElement>(document.querySelector('html'))

  const loadingContextValue = useMemo(
    () => ({
      isShowLoading,
      showLoading: () => setIsShowLoading(true),
      hideLoading: () => setIsShowLoading(false),
    }),
    [isShowLoading],
  )

  useEffect(() => {
    if (htmlElementRef.current) {
      htmlElementRef.current.style.pointerEvents = isShowLoading ? 'none' : 'auto'
      htmlElementRef.current.style.userSelect = isShowLoading ? 'none' : 'auto'
    }
  }, [isShowLoading])

  return (
    <LoadingContext.Provider value={loadingContextValue}>
      {children}
      <LoadingOverlay open={isShowLoading} />
    </LoadingContext.Provider>
  )
}
