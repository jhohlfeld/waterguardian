'use client'

import { signIn } from '@/lib/auth'
import { AvatarIcon } from '@radix-ui/react-icons'
import { Button, Dialog, TextField } from '@radix-ui/themes'
import { useActionState } from 'react'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined)
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button radius="full" variant="ghost" className="w-8 h-8">
          <AvatarIcon className="w-8 h-8" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="w-full md:max-w-md">
        <Dialog.Title>Login</Dialog.Title>
        <Dialog.Description>
          Logge dich ein, um bei Waterguardian mitzuhelfen!
        </Dialog.Description>
        <form className="flex flex-col gap-8 mt-8 max-w-md" action={formAction}>
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
            <Dialog.Close>
              <Button variant="soft" color="gray" loading={pending}>
                Schließen
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button type="submit" loading={pending}>
                Login
              </Button>
            </Dialog.Close>
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
