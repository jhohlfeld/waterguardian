import { cn } from "@/utils"
import { Flex, IconButton, VisuallyHidden } from "@radix-ui/themes"
import {
  BubbleMenu as BubbleMenuPrimitive,
  type BubbleMenuProps,
} from "@tiptap/react"
import { cva } from "class-variance-authority"
import { Bold, Italic, Strikethrough } from "lucide-react"

const button = cva("", {
  variants: {
    active: {
      true: "bg-accent-5",
    },
  },
})

export const BubbleMenu = ({ editor }: Pick<BubbleMenuProps, "editor">) =>
  editor && (
    <BubbleMenuPrimitive
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className={cn(
        "bg-accent-2 shadow-3 border border-accent-surface rounded-4 p-3",
      )}
    >
      <Flex gap="3">
        <IconButton
          radius="large"
          variant="ghost"
          color="gray"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={button({ active: editor.isActive("bold") })}
        >
          <Bold size="20" />
          <VisuallyHidden>Bold</VisuallyHidden>
        </IconButton>
        <IconButton
          radius="large"
          variant="ghost"
          color="gray"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={button({ active: editor.isActive("italic") })}
        >
          <Italic size="20" />
          <VisuallyHidden>Kursiv</VisuallyHidden>
        </IconButton>
        <IconButton
          radius="large"
          variant="ghost"
          color="gray"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={button({ active: editor.isActive("strike") })}
        >
          <Strikethrough size="20" />
          <VisuallyHidden>Durchgestrichen</VisuallyHidden>
        </IconButton>
      </Flex>
    </BubbleMenuPrimitive>
  )
