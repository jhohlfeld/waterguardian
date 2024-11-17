"use client"

import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Box, IconButton, Tooltip } from "@radix-ui/themes"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export const AppearanceSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, themes, setTheme } = useTheme()
  const nextIndex = theme ? themes.indexOf(theme) + 1 : 0
  const nextTheme = themes[nextIndex] ?? themes[0]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Box position="fixed" bottom="0" right="0" m="4">
      <Tooltip content="Dunkelmodus umschalten">
        <IconButton
          color="gray"
          onClick={() => (nextTheme ? setTheme(nextTheme) : undefined)}
          radius="full"
          variant="outline"
        >
          {theme === "light" ?
            <>
              <Sun />
              <VisuallyHidden>Hellen Modus einschalten</VisuallyHidden>
            </>
          : theme === "dark" ?
            <>
              <Moon />
              <VisuallyHidden>Dunklen Modus einschalten</VisuallyHidden>
            </>
          : <>
              <Laptop />
              <VisuallyHidden>System-Modus einschalten</VisuallyHidden>
            </>
          }
        </IconButton>
      </Tooltip>
    </Box>
  )
}
