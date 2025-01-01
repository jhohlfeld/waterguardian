'use client'

import { useEffect, useMemo } from 'react'

export const DarkMode = () => {
  // Initialize dark mode immediately
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isDark = mediaQuery.matches

    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }

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
    }
    onChangeHandler(mql)

    // listen for changes
    mql.addEventListener('change', onChangeHandler)

    // clean up
    return () => mql.removeEventListener('change', onChangeHandler)
  }, [mql])

  return null
}
