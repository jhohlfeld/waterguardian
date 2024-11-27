'use client'

import { useEffect, useMemo } from 'react'

export const DarkMode = () => {
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
    const onChangeHandler = (e: MediaQueryList | MediaQueryListEvent) =>
      document.querySelector('html')?.classList.toggle('dark', e.matches)
    onChangeHandler(mql)

    // listen for changes
    mql.addEventListener('change', onChangeHandler)

    // clean up
    return () => mql.removeEventListener('change', onChangeHandler)
  }, [mql])

  return null
}
