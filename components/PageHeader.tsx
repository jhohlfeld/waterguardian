'use client'

import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { AccessibleIcon, IconButton, Separator } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'

export function PageHeader({
  back,
  children,
}: PropsWithChildren<{ back?: string }>) {
  const router = useRouter()
  return (
    <header className="flex flex-col gap-2">
      <h1 className="flex items-center gap-2 text-3xl font-semibold">
        {back && (
          <AccessibleIcon label="Zurück">
            <IconButton
              variant="ghost"
              color="gray"
              radius="full"
              onClick={() => router.back()}
            >
              <ChevronLeftIcon className="size-8" />
            </IconButton>
          </AccessibleIcon>
        )}
        <span>{children}</span>
      </h1>
      <Separator className="w-full" />
    </header>
  )
}
