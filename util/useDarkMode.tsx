'use client'

import { useEffect, useMemo, useState } from 'react'

export const DarkMode = () => {
  useDarkMode()
  return null
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  const mql = useMemo(() => {
    if (typeof matchMedia === 'undefined') {
      return
    }
    return matchMedia('(prefers-color-scheme: dark)')
  }, [])

  useEffect(() => {
    if (!mql) {
      return
    }

    // toggle class attribute based on media query
    const onChangeHandler = (e: MediaQueryList | MediaQueryListEvent) => {
      const isDark = e.matches
      document.querySelector('html')?.classList.toggle('dark', isDark)
      setIsDark(isDark)
    }
    onChangeHandler(mql)

    // listen for changes
    mql.addEventListener('change', onChangeHandler)

    // clean up
    return () => mql.removeEventListener('change', onChangeHandler)
  }, [mql])

  return isDark
}
