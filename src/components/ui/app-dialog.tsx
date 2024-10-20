import { ReactNode } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'

interface AppDialogProps {
  children: ReactNode
  open: boolean
  title?: string
  description?: string
  isStatic?: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose?: () => void
}

export const AppDialog = ({
  children,
  open,
  title,
  description,
  isStatic,
  onOpenChange,
  onClose,
}: AppDialogProps) => {
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen && onClose) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onPointerDownOutside={e => {
          if (isStatic) {
            e.preventDefault()
          }
        }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}
