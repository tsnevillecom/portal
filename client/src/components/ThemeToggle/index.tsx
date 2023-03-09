import useTheme from '@hooks/useTheme'
import React from 'react'
import './ThemeToggle.scss'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div id="theme-toggle" onClick={toggleTheme}>
      <div id="theme-toggle-dot" className={theme}></div>
    </div>
  )
}

export default ThemeToggle
