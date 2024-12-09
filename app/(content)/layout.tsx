import { PropsWithChildren } from 'react'

export default function ContentPagesLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col items-center">
      <article className="max-w-screen-lg prose lg:prose-xl mx-6 my-[5vh]">
        {children}
      </article>
    </main>
  )
}
