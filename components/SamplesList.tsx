import { Sample } from '@/lib/schema'
import { Button } from '@radix-ui/themes'
import NextLink from 'next/link'
import { use } from 'react'

export function SamplesList(props: { samples: Promise<Sample[]> }) {
  const samples = use(props.samples)
  return (
    <nav className="list-none gap-2 grid">
      {samples.map(({ id }) => (
        <li key={id}>
          <Button variant="ghost">
            <NextLink href={`/samples/${id}`}>{id}</NextLink>
          </Button>
        </li>
      ))}
    </nav>
  )
}
