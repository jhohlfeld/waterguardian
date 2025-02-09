'use client'

import { signIn } from '@/lib/auth'
import * as Dialog from '@radix-ui/react-dialog'
import { AvatarIcon } from '@radix-ui/react-icons'
import { Button, TextField } from '@radix-ui/themes'
import { useActionState } from 'react'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined)
  return (
    <Dialog.Root>
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
                <TextField.Root
                  type="email"
                  name="email"
                  placeholder="Gib deine Email-Adresse an"
                />
              </label>
              <label className="flex flex-col gap-1">
                Email-Token
                <TextField.Root
                  type="password"
                  name="token"
                  placeholder="Gib dein Passwort an"
                />
              </label>
              {state?.message && (
                <div className="text-reda-11">{state.message}</div>
              )}
            </main>
            <footer className="flex gap-2 justify-end">
              <Dialog.Close asChild>
                <Button variant="soft" color="gray" loading={pending}>
                  Schließen
                </Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button type="submit" loading={pending}>
                  Login
                </Button>
              </Dialog.Close>
            </footer>
          </form>
          <Dialog.Close asChild className="absolute top-4 right-4">
            <Button variant="ghost" radius="full" className="h-8 w-8 p-0">
              <AvatarIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
