/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import './Spinner.scss'

interface SpinnerProps {
  size?: number
  text?: string
}

const Spinner = ({ size = 100, text = '' }: SpinnerProps) => {
  const $sm = size * 0.6 + 'px'
  const $smMargin = (-size * 0.6) / 2 + 'px'
  const $md = size * 0.8 + 'px'
  const $mdMargin = (-size * 0.8) / 2 + 'px'
  const $lg = size + 'px'
  const $lgMargin = -size / 2 + 'px'

  const styles = {
    spinnerFrame: {
      height: size + 'px',
    },
    spinner: {
      borderWidth: Math.ceil(size * 0.03) + 'px',
      borderRadius: size + 'px',
    },
    spinnerSm: {
      margin: $smMargin + ' 0 0 ' + $smMargin,
      height: $sm,
      width: $sm,
    },
    spinnerMd: {
      margin: $mdMargin + ' 0 0 ' + $mdMargin,
      height: $md,
      width: $md,
    },
    spinnerLg: {
      margin: $lgMargin + ' 0 0 ' + $lgMargin,
      height: $lg,
      width: $lg,
    },
  }

  return (
    <div id="spinner">
      <div>
        <div id="spinner-wrapper" style={styles.spinnerFrame}>
          <div
            className="spinner"
            id="spinner-lg"
            style={{ ...styles.spinnerLg, ...styles.spinner }}
          />
          <div
            className="spinner"
            id="spinner-md"
            style={{ ...styles.spinnerMd, ...styles.spinner }}
          />
          <div
            className="spinner"
            id="spinner-sm"
            style={{ ...styles.spinnerSm, ...styles.spinner }}
          />
        </div>
        {!!text && <div id="spinner-message">{text}</div>}
      </div>
    </div>
  )
}

export default Spinner
