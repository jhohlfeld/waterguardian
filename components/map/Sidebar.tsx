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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [open])

  if (!isVisible && !open) return null

  return (
    <div
      className={cn(
        'absolute top-4 right-4 z-40',
        'h-fit w-80 bg-gray-1 border-l border-gray-6',
        'shadow-lg p-4',
        'rounded-xl overflow-y-auto',
        'duration-300',
        open
          ? 'animate-in fade-in slide-in-from-right-[110%]'
          : 'animate-out fade-out slide-out-to-right-[110%]',
      )}
    >
      <h2 className="text-lg font-bold text-gray-12">Aktuelle Daten</h2>

      <Separator className="my-6 bg-gray-6 h-px w-full" />

      <button
        onClick={onClose}
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
