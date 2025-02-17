'use client'

import { Sample } from '@/lib/schema'
import { createUploadUrl } from '@/lib/upload'
import { cn } from '@/util/cn'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import {
  AccessibleIcon,
  Button,
  Card,
  IconButton,
  Inset,
} from '@radix-ui/themes'
import byteSize from 'byte-size'
import { clsx } from 'clsx'
import Image from 'next/image'
import {
  ChangeEvent,
  TransitionStartFunction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react'
import { z } from 'zod'

const maxImageSize = 1900

type ImageType = z.infer<typeof imageSchema>
const imageSchema = z.object({
  id: z.string(),
  src: z.string(),
  name: z.string(),
  size: z.number(),
  width: z.number(),
  height: z.number(),
})

type UploadImage = z.infer<typeof uploadImageSchema>
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- intended
const uploadImageSchema = imageSchema.extend({
  file: z.instanceof(Blob),
  progress: z.instanceof(EventTarget),
})

function isUpload(upload: ImageType | UploadImage): upload is UploadImage {
  return 'file' in upload
}

async function createUpload(file: File): Promise<UploadImage | void> {
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
    size: file.size,
    file: optimized,
    height,
    width,
    progress: new EventTarget(),
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

function Progress({
  upload,
  startTransition,
}: {
  upload: UploadImage
  startTransition: TransitionStartFunction
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function startUpload() {
      const { file, name, id } = upload
      const key = `samples/${id}.${name.replace(/.*\.(\w+)$/, '$1')}`
      const url = await createUploadUrl(key)

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', url)
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && ref.current) {
            ref.current.style.setProperty(
              '--percentage',
              String((1 / upload.file.size) * event.loaded),
            )
          }
        }
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send(file)
      })

      upload.progress.dispatchEvent(new Event('finished'))
    }

    const handleStartUpload = () => startTransition(startUpload)
    upload.progress.addEventListener('startUpload', handleStartUpload)

    return () => {
      upload.progress.removeEventListener('startUpload', handleStartUpload)
    }
  }, [startTransition, upload])

  return (
    <div
      ref={ref}
      className={clsx(
        'relative h-2 bg-black-a3 -translate-x-[--card-padding] w-[calc(100%+var(--card-padding)*2)]',
        'after:absolute after:contents-[""] after:left-0 after:top-0 after:h-2 after:bg-green-9',
        'after:w-[calc(var(--percentage)*100%)]',
      )}
    />
  )
}

function Preview({
  image,
  onDelete,
}: {
  image: UploadImage | ImageType
  onDelete: () => void
}) {
  const [pending, startTransition] = useTransition()
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
      {isUpload(image) && (
        <Progress upload={image} startTransition={startTransition} />
      )}
      <ul className="text-xs text-gray-11 mt-2">
        <li className="overflow-hidden text-ellipsis whitespace-nowrap">
          {image.name}
        </li>
        <li>
          {image.width}x{image.height}px
        </li>
        <li>{String(byteSize(image.size))}</li>
      </ul>
      <IconButton
        disabled={pending}
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
  const [images, setImages] = useState<ImageType[]>([])
  const [uploads, setUploads] = useState<UploadImage[]>([])

  function handlePreview(files: File[]) {
    files.map(async (file) => {
      const optimized = await createUpload(file)

      if (optimized) {
        setUploads((state) => state.concat(optimized))
      }
    })
  }

  function handleOnDelete(image: UploadImage | ImageType) {
    if (isUpload(image)) {
      setUploads((state) => state.filter(({ id }) => id !== image.id))
    } else {
      setImages((state) => state.filter(({ id }) => id !== image.id))
    }
  }

  function handleUpload() {
    uploads.forEach((item) => {
      item.progress.addEventListener('finished', () => {
        setImages((state) => state.concat(imageSchema.parse(item)))
        setUploads((state) => state.filter(({ id }) => id !== item.id))
      })
      item.progress.dispatchEvent(new Event('startUpload'))
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          'grid gap-2',
          'grid-cols-[repeat(auto-fill,calc(9em+var(--space-3)*2))]',
          'grid-rows-[repeat(auto-fill,minmax(calc(12em+var(--space-3)*2),min-content))]',
        )}
      >
        {images.map((item, i) => (
          <Preview key={i} image={item} onDelete={() => handleOnDelete(item)} />
        ))}
        {uploads.map((item, i) => (
          <Preview key={i} image={item} onDelete={() => handleOnDelete(item)} />
        ))}
        <Upload onChange={handlePreview} />
      </div>
      <Button
        className="self-start"
        disabled={uploads.length === 0}
        onClick={() => handleUpload()}
      >
        Speichern
      </Button>
    </div>
  )
}
