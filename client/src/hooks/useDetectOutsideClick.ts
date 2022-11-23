import { useState, useEffect } from 'react'

export const useDetectOutsideClick = (
  el: React.RefObject<HTMLDivElement>,
  initialState: boolean
): [boolean, (isActive: boolean) => void] => {
  const [isActive, setIsActive] = useState(initialState)

  useEffect(() => {
    const pageClickEvent = (e: Event) => {
      // If the active element exists and is clicked outside of
      if (
        el.current &&
        e.target instanceof Node &&
        !el.current.contains(e.target)
      ) {
        setIsActive(!isActive)
      }
    }

    if (isActive) {
      window.addEventListener('click', pageClickEvent)
    }

    return () => {
      window.removeEventListener('click', pageClickEvent)
    }
  }, [isActive, el])

  return [isActive, setIsActive]
}
