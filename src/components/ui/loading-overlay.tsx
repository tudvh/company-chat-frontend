import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

type LoadingOverLayProps = {
  open: boolean
}

export const LoadingOverlay = (props: LoadingOverLayProps) => {
  const { open } = props

  return (
    <div
      className={cn(
        open ? 'opacity-1 z-[10000]' : '-z-50 opacity-0',
        'pointer-events-auto fixed inset-0 flex items-center justify-center overflow-hidden bg-foreground/85 transition-opacity duration-200 ease-in-out',
      )}
    >
      <div className="rounded-lg bg-background px-6 py-10">
        <div className="text-foreground">
          <LoaderCircle className="size-12 animate-spin ease-linear" />
        </div>
      </div>
    </div>
  )
}
