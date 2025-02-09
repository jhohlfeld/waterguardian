'use client'

import { signIn } from '@/lib/auth'
import * as Dialog from '@radix-ui/react-dialog'
import { AvatarIcon, Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import { useActionState, useEffect, useState } from 'react'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined)
  const [open, setOpen] = useState(false)

  // Close dialog and refresh on successful login
  useEffect(() => {
    if (state?.success) {
      setOpen(false)
      window.location.reload() // Refresh to update session state
    }
  }, [state?.success])
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button radius="full" variant="ghost" className="w-8 h-8">
          <AvatarIcon className="w-8 h-8" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal
        container={
          typeof document !== 'undefined'
            ? document.getElementById('dialog-root')
            : undefined
        }
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:max-w-md bg-gray-1 rounded-lg shadow-lg z-[101] p-6">
          <Dialog.Title className="text-xl font-bold mb-2">Login</Dialog.Title>
          <Dialog.Description className="text-gray-11 mb-6">
            Logge dich ein, um bei Waterguardian mitzuhelfen!
          </Dialog.Description>
          <form className="flex flex-col gap-8 mt-4" action={formAction}>
            <main className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                Email
                <input
                  type="email"
                  name="email"
                  className="flex-1 w-full rounded-md bg-gray-3 px-3 py-2 text-gray-12 outline-none focus:ring-2 focus:ring-accent-8"
                  placeholder="Gib deine Email-Adresse an"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                Email-Token
                <input
                  type="password"
                  name="token"
                  className="flex-1 w-full rounded-md bg-gray-3 px-3 py-2 text-gray-12 outline-none focus:ring-2 focus:ring-accent-8"
                  placeholder="Gib dein Passwort an"
                  required
                />
              </label>
              {state?.message && (
                <div className="text-red-11">{state.message}</div>
              )}
            </main>
            <footer className="flex gap-2 justify-end">
              <Dialog.Close asChild>
                <Button
                  variant="soft"
                  color="gray"
                  type="button"
                  disabled={pending}
                >
                  Schließen
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={pending}>
                {pending ? 'Logging in...' : 'Login'}
              </Button>
            </footer>
          </form>
          <Dialog.Close asChild className="absolute top-4 right-4">
            <Button variant="ghost" radius="full" className="h-8 w-8 p-0">
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
