import { PropsWithChildren } from 'react'

export default function ContentPagesLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col items-center w-full">
      <article className="prose w-full max-w-screen-lg md:prose-lg px-4 md:px-6 py-8 md:py-[5vh]">
        {children}
      </article>
    </main>
  )
}
