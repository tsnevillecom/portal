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
    const removeClass = theme === 'dark' ? 'light' : 'dark'
    document.body.classList.remove(removeClass)
    document.body.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}

export default useTheme
