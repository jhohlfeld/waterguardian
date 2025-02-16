import { ListSkeleton } from '@/components/ListSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { SamplesList } from '@/components/SamplesList'
import { loadAllSamples } from '@/lib/samples'
import { Suspense } from 'react'

export default async function SamplesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader>Samples</PageHeader>
      <main>
        <section>
          <Suspense fallback={<ListSkeleton />}>
            <SamplesList samples={loadAllSamples()} />
          </Suspense>
        </section>
      </main>
    </div>
  )
}
