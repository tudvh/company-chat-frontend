import { useEffect, useState } from 'react'

import { HealthCheckService } from '@/services/api'
import { LayoutProps } from '@/types'
import { InternalServerErrorPage } from '../partials/error'
import { LoadingOverlay } from '../ui'

export const HealthCheckProvider = ({ children }: LayoutProps) => {
  const [isOk, setIsOk] = useState<boolean | undefined>(undefined)

  const checkHealth = async () => {
    try {
      await HealthCheckService.checkHealth()
      setIsOk(true)
    } catch (error) {
      setIsOk(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  if (isOk === undefined) {
    return <LoadingOverlay open />
  }
  if (isOk === false) {
    return (
      <div className="h-dvh w-dvw">
        <InternalServerErrorPage />
      </div>
    )
  }
  return children
}
