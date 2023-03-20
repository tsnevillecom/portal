import React, { useState, useEffect } from 'react'
import './FormError.scss'
import { MdErrorOutline } from 'react-icons/md'

type AlignOptions = 'left' | 'center' | 'right'

interface FormErrorProps {
  text: string
  icon?: React.ReactNode
  align?: AlignOptions
  name?: string
}

const defaultProps: FormErrorProps = {
  text: '',
  icon: <MdErrorOutline />,
  align: 'left',
  name: '',
}

const FormError: React.FC<FormErrorProps> = ({ text, icon, align, name }) => {
  const [justifyContent, setJustifyContent] = useState('flex-start')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(!!text)
  })

  useEffect(() => {
    switch (align) {
      case 'center':
        setJustifyContent('center')
        break
      case 'right':
        setJustifyContent('flex-end')
        break
      default:
        setJustifyContent('flex-start')
    }
  }, [align])

  if (!isVisible) return null

  return (
    <div className="form-error" style={{ justifyContent }} data-name={name}>
      {icon}
      {text}
    </div>
  )
}

FormError.defaultProps = defaultProps

export default FormError
