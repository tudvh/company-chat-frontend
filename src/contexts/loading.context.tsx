import { createContext, useContext, useMemo, useState } from 'react'

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

  const loadingContextValue = useMemo(
    () => ({
      isShowLoading,
      showLoading: () => setIsShowLoading(true),
      hideLoading: () => setIsShowLoading(false),
    }),
    [isShowLoading],
  )

  return (
    <LoadingContext.Provider value={loadingContextValue}>
      {children}
      <LoadingOverlay open={isShowLoading} />
    </LoadingContext.Provider>
  )
}
