import { PropsWithChildren } from 'react'

export default function SamplesLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col flex-1 w-full p-4 max-w-7xl mx-auto justify-stretch">
      {children}
    </main>
  )
}
