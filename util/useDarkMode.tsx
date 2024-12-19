'use client'

import { initDarkMode } from '@/util/initDarkMode'
import { useEffect, useMemo } from 'react'

export const DarkMode = () => {
  // Initialize dark mode immediately
  initDarkMode()
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

    // toggle class attribute bsed on media query
    const onChangeHandler = (e: MediaQueryList | MediaQueryListEvent) => {
      const isDark = e.matches
      document.querySelector('html')?.classList.toggle('dark', isDark)
    }
    onChangeHandler(mql)

    // listen for changes
    mql.addEventListener('change', onChangeHandler)

    // clean up
    return () => mql.removeEventListener('change', onChangeHandler)
  }, [mql])

  return null
}
