'use client'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Separator } from '@radix-ui/react-separator'
import { ReactNode, useEffect, useState } from 'react'
import { cn } from '../../util/cn'

interface SidebarProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export const Sidebar = ({ open, onClose, children }: SidebarProps) => {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setIsClosing(false)
    }
  }, [open])

  const handleClose = () => {
    setIsClosing(true)
    // Wait for animation to complete before calling onClose
    setTimeout(onClose, 300) // 300ms matches the animation duration
  }

  if (!open && !isClosing) return null

  return (
    <div
      className={cn(
        'absolute top-4 right-4',
        'h-fit w-80 bg-gray-1 border-l border-gray-6',
        'shadow-lg p-4',
        'rounded-xl overflow-y-auto',
        'transition-all duration-300 ease-in-out',
        isClosing
          ? 'translate-x-[110%] opacity-0'
          : 'translate-x-0 opacity-100',
      )}
    >
      <h2 className="text-lg font-bold text-gray-11">Aktuelle Daten</h2>

      <Separator className="my-6 bg-gray-6 h-px w-full" />

      <button
        onClick={handleClose}
        className={cn(
          'absolute top-2 right-2',
          'h-6 w-6 rounded-full',
          'flex items-center justify-center',
          'text-gray-11 hover:text-gray-12',
          'hover:bg-gray-3',
          'transition-colors duration-300',
        )}
        aria-label="Close"
      >
        <Cross2Icon />
      </button>

      <div className="text-gray-11">{children}</div>
    </div>
  )
}
