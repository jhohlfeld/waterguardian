import { PageHeader } from '@/components/PageHeader'
import { SampleImages } from '@/components/SampleImages'
import { loadSample } from '@/lib/samples'
import { redirect } from 'next/navigation'

export default async function SampleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sample = await loadSample(id)

  if (!sample) {
    redirect('/samples')
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader back="/samples">{sample.id}</PageHeader>

      <main>
        <section>
          <SampleImages sample={sample} />
        </section>
      </main>
    </div>
  )
}
