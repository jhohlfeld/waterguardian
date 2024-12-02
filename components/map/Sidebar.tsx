'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
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
        <Dialog.Content
          className={cn(
            'fixed top-[calc(var(--header-height)+1rem)] right-4',
            'h-[70vh] w-80 bg-[--gray-1] border-l border-[--gray-6]',
            open ? 'animate-slideIn' : 'animate-slideOut',
            'shadow-lg p-4',
            'rounded-xl',
          )}
        >
          <Dialog.Title className="sr-only text-[--gray-12] font-medium">
            Measurement Details
          </Dialog.Title>

          <Separator className="my-6 bg-[--gray-6] h-px w-full" />

          <Dialog.Close
            className={cn(
              'absolute top-2 right-2',
              'h-6 w-6 rounded-full',
              'flex items-center justify-center',
              'text-[--gray-11] hover:text-[--gray-12]',
              'hover:bg-[--gray-3]',
              'transition-colors duration-300',
            )}
            aria-label="Close"
          >
            <Cross2Icon />
          </Dialog.Close>

          <div className="text-[--gray-12]">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
