'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Separator } from '@radix-ui/react-separator'
import { ReactNode } from 'react'
import { cn } from '../../util/cn'

interface SidebarProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export const Sidebar = ({ open, onClose, children }: SidebarProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Transform Transition not working, why? */}
        <Dialog.Content
          className={cn(
            'absolute top-[var(--header-height)] right-0',
            'h-[80vh] w-80 bg-background shadow-lg p-4',
            'transition-transform duration-700 ease-in-out',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <Dialog.Title className="sr-only">Measurement Details</Dialog.Title>
          {/* Colors not working, why? */}
          <Separator className="my-4 bg-grey-12 h-1 w-full" />
          <div className="my-4 border-b-2 border-gray-200 w-full"></div>
          <Dialog.Close
            className="absolute top-2 right-2 text-gray-12 hover:text-gray-6"
            aria-label="Close"
          >
            ✖
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
