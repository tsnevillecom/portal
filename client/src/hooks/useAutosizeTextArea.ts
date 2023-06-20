import { useEffect } from 'react'

const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  maxRows: number
) => {
  useEffect(() => {
    if (textAreaRef) {
      const lineHeightPx = parseInt(
        window.getComputedStyle(textAreaRef).lineHeight.replace('px', '')
      )
      const paddingTopPx = parseInt(
        window
          .getComputedStyle(textAreaRef, null)
          .getPropertyValue('padding-top')
          .replace('px', '')
      )
      const paddingBtmPx = parseInt(
        window
          .getComputedStyle(textAreaRef, null)
          .getPropertyValue('padding-bottom')
          .replace('px', '')
      )
      const padding = paddingTopPx + paddingBtmPx
      const maxHeight = maxRows * lineHeightPx + padding

      textAreaRef.style.height = '0px'
      const scrollHeight =
        textAreaRef.scrollHeight <= maxHeight
          ? textAreaRef.scrollHeight
          : maxHeight

      textAreaRef.style.height = scrollHeight + 'px'
      textAreaRef.style.overflow =
        textAreaRef.scrollHeight <= maxHeight ? 'hidden' : 'hidden scroll'
    }
  }, [textAreaRef, value])
}

export default useAutosizeTextArea
