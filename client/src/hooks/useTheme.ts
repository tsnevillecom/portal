import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

interface IUseTheme {
  theme: string
  toggleTheme: () => void
}

const useTheme = (): IUseTheme => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>(
    'ui-theme',
    'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}

export default useTheme
