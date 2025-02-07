'use client'

import { Checkbox, CheckboxIndicator } from '@radix-ui/react-checkbox'
import {
  CheckIcon,
  Component2Icon,
  LayersIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import {
  PopoverContent,
  PopoverTrigger,
  Portal,
  Root,
} from '@radix-ui/react-popover'
import { useEffect, useState } from 'react'
import { cn } from '../../util/cn'

interface FilterPopoverProps {
  onFilterChange: (selectedTypes: string[]) => void
  onOpen?: () => void
}

const types = [
  { id: 'manual', label: 'Citizen Science Daten', icon: PersonIcon },
  { id: 'lab', label: 'Labor-Daten', icon: Component2Icon },
]

export const FilterPopover = ({
  onFilterChange,
  onOpen,
}: FilterPopoverProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    types.map((t) => t.id),
  )

  const handleCheckboxChange = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId],
    )
  }

  useEffect(() => {
    onFilterChange(selectedTypes)
  }, [selectedTypes, onFilterChange])

  return (
    <Root
      onOpenChange={(open) => {
        if (open && onOpen) {
          onOpen()
        }
      }}
    >
      <PopoverTrigger asChild>
        <button className="absolute bottom-12 right-4 p-2 bg-gray-1 rounded-full shadow-md z-50">
          <span className="sr-only">Open filters</span>
          <LayersIcon className="text-gray-11" />
        </button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          className={cn(
            'p-4 right-4 bg-gray-1 rounded-lg shadow-lg z-50',
            'duration-300',
            'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-[100%]',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-[100%]',
          )}
          side="top"
          align="end"
          sideOffset={4}
        >
          <h3 className="text-lg font-bold text-gray-12 mb-4">Filter Daten</h3>
          {types.map((type) => {
            const Icon = type.icon
            const isSelected = selectedTypes.includes(type.id)
            return (
              <div
                key={type.id}
                className="flex items-center mb-2 gap-2 w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-8 h-8 mr-1 flex items-center justify-center rounded-full transition-colors',
                      isSelected ? 'bg-accent-6' : 'bg-accent-3',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isSelected ? 'text-accent-12' : 'text-gray-11',
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'transition-colors',
                      isSelected ? 'text-gray-11' : 'text-gray-10',
                    )}
                  >
                    {type.label}
                  </span>
                </div>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleCheckboxChange(type.id)}
                  className={cn(
                    'w-5 h-5 ml-2 border border-gray-6 rounded transition-colors',
                    isSelected ? 'bg-accent-11' : 'bg-accent-6',
                    'hover:bg-accent-7 active:bg-accent-8',
                  )}
                >
                  <CheckboxIndicator>
                    <CheckIcon className="text-gray-1" />
                  </CheckboxIndicator>
                </Checkbox>
              </div>
            )
          })}
        </PopoverContent>
      </Portal>
    </Root>
  )
}
