export function initDarkMode(): void {
  try {
    if (typeof window === 'undefined') return

    const mediaQuery: MediaQueryList = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )
    const isDark: boolean = mediaQuery.matches

    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  } catch (e) {
    console.error('Error initializing dark mode:', e)
  }
}
