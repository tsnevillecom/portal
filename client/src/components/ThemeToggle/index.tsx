import useTheme from '@hooks/useTheme'
import React from 'react'
import './ThemeToggle.scss'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div id="theme">
      <div id="theme-toggle" className={theme} onClick={toggleTheme}>
        <div id="theme-toggle-dot"></div>
      </div>
      <div id="theme-mode">{theme}</div>
    </div>
  )
}

export default ThemeToggle
