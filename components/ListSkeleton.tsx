import { Skeleton } from '@radix-ui/themes'

export function ListSkeleton() {
  return (
    <ul>
      {['opacity-100', 'opacity-65', 'opacity-15'].map((i) => (
        <Skeleton key={i} className={`$i`} />
      ))}
    </ul>
  )
}
