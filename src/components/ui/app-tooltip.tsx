import { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

interface AppTooltipProps {
  children: ReactNode
  content: string | number
  position?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delay?: number
  asChild?: boolean
  className?: string
}

export const AppTooltip = ({
  children,
  content,
  position,
  align,
  delay = 0,
  asChild = false,
  className,
}: AppTooltipProps) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild={asChild} className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={position} align={align}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
