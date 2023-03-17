/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import './PasswordMeter.scss'

import { AiTwotoneCheckCircle } from 'react-icons/ai'
import { FaCheck } from 'react-icons/fa'
import _ from 'lodash'

interface PasswordMeterProps {
  password: string
}

interface PasswordMeterStatus {
  [key: string]: boolean
}

const PasswordMeter = ({ password }: PasswordMeterProps) => {
  const [strength, setStrength] = useState<number>(0)
  const [status, setStatus] = useState<PasswordMeterStatus>({})

  useEffect(() => {
    handlePassword(password)
  }, [password])

  const handlePassword = (passwordValue: string) => {
    const passwordAttrStatus = {
      length: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    }

    passwordAttrStatus.length = passwordValue.length >= 8 ? true : false
    passwordAttrStatus.hasUpperCase = /[A-Z]+/.test(passwordValue)
    passwordAttrStatus.hasLowerCase = /[a-z]+/.test(passwordValue)
    passwordAttrStatus.hasDigit = /[0-9]+/.test(passwordValue)
    passwordAttrStatus.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue)
    const verifiedListLength = _.chain(passwordAttrStatus)
      .values()
      .filter((value) => value)
      .size()
      .value()

    setStrength(verifiedListLength)
    setStatus(passwordAttrStatus)
  }

  const renderIcon = (render: boolean) => {
    return (
      <span className="password-attr-state">
        {render ? (
          <FaCheck className="password-attr-check" />
        ) : (
          <AiTwotoneCheckCircle className="password-attr-x" />
        )}
      </span>
    )
  }

  return (
    <div id="password-meter">
      <div id="password-meter-progress-wrapper">
        <div id="password-meter-progress" className={`strength-${strength}`} />
      </div>
      <div id="password-check">
        <div>
          {renderIcon(status.hasLowerCase)}
          <span className="password-attr">One lowercase character</span>
        </div>
        <div>
          {renderIcon(status.hasSpecialChar)}
          <span className="password-attr">One special character</span>
        </div>
        <div>
          {renderIcon(status.hasUpperCase)}
          <span className="password-attr">One uppercase character</span>
        </div>
        <div>
          {renderIcon(status.length)}
          <span className="password-attr">8 characters minimum</span>
        </div>
        <div>
          {renderIcon(status.hasDigit)}
          <span className="password-attr">One number</span>
        </div>
      </div>
    </div>
  )
}

export default PasswordMeter
