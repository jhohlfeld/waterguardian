'use client'

import { Sample } from '@/lib/schema'
import { cn } from '@/util/cn'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { AccessibleIcon, Card, IconButton, Inset } from '@radix-ui/themes'
import byteSize from 'byte-size'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

const maxImageSize = 1900

interface UploadImage {
  id: string
  src: string
  file: Blob
  name: string
  width: number
  height: number
}

async function optimizeImage(file: File): Promise<UploadImage | void> {
  const bitmap = await createImageBitmap(file)

  let { width, height } = bitmap
  const ratio = width / height
  if (width > maxImageSize) {
    width = maxImageSize
    height = Math.round(maxImageSize / ratio)
  }
  if (height > maxImageSize) {
    height = maxImageSize
    width = Math.round(maxImageSize * ratio)
  }

  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')

  if (!ctx) {
    console.error('Error creating draw context')
    return
  }

  ctx.drawImage(bitmap, 0, 0, width, height)
  const optimized = await offscreen.convertToBlob({ type: 'image/avif' })

  return {
    id: crypto.randomUUID(),
    src: URL.createObjectURL(optimized),
    name: file.name.replace(/(.*)\.(\w+)$/, '$1.avif'),
    file: optimized,
    height,
    width,
  }
}

function Upload({
  onChange,
}: {
  onChange: (files: File[]) => void | Promise<void>
}) {
  const [value, setValue] = useState<string>('')

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }

    onChange(
      Array.from(event.target.files).filter(
        ({ size, type }) =>
          type.startsWith('image/') && size < 50 * 1024 * 1024,
      ),
    )
    setValue('')
  }

  return (
    <Card className="flex items-center justify-center">
      <IconButton
        variant="ghost"
        color="gray"
        radius="full"
        className="relative overflow-hidden"
      >
        <AccessibleIcon label="Hinzufügen">
          <PlusIcon width="7em" height="7em" />
        </AccessibleIcon>
        <input
          type="file"
          multiple
          className="absolute scale-[5] opacity-0"
          value={value}
          onChange={handleOnChange}
        />
      </IconButton>
    </Card>
  )
}

function Preview({
  image,
  onDelete,
}: {
  image: UploadImage
  onDelete: () => void
}) {
  return (
    <Card>
      <Inset
        clip="padding-box"
        side="top"
        pb="current"
        className="relative aspect-4/3"
      >
        <Image src={image.src} fill alt={image.name} className="object-cover" />
      </Inset>
      <ul className="text-xs text-gray-11 mt-2">
        <li className="overflow-hidden text-ellipsis whitespace-nowrap">
          {image.name}
        </li>
        <li>
          {image.width}x{image.height}px
        </li>
        <li>{String(byteSize(image.file.size))}</li>
      </ul>
      <IconButton
        className="absolute bottom-3 right-3"
        variant="ghost"
        color="gray"
        radius="full"
        onClick={() => onDelete()}
      >
        <AccessibleIcon label="Löschen">
          <TrashIcon width="1.25em" height="1.25em" />
        </AccessibleIcon>
      </IconButton>
    </Card>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- todo: remove/wip
export function SampleImages({ sample }: { sample: Sample }) {
  const [upload, setUpload] = useState<UploadImage[]>([])

  function handleUpload(files: File[]) {
    files.map(async (file) => {
      const optimized = await optimizeImage(file)

      if (optimized) {
        setUpload((upload) => upload.concat(optimized))
      }
    })
  }

  function handleOnDelete(image: UploadImage) {
    setUpload(upload.filter(({ id }) => id !== image.id))
  }

  return (
    <div
      className={cn(
        'grid gap-2',
        'grid-cols-[repeat(auto-fill,calc(9em+var(--space-3)*2))]',
        'grid-rows-[repeat(auto-fill,minmax(calc(12em+var(--space-3)*2),min-content))]',
      )}
    >
      {upload.map((image, i) => (
        <Preview key={i} image={image} onDelete={() => handleOnDelete(image)} />
      ))}
      <Upload onChange={handleUpload} />
    </div>
  )
}
