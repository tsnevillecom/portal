import React from 'react'

interface ResendEmailProps {
  onClick: () => void
  resendStatus?: 'success' | 'error' | null
}

const ResendEmail = ({ onClick, resendStatus }: ResendEmailProps) => {
  return (
    <p className="small">
      {!resendStatus && (
        <>
          <strong>Didn&apos;t receive an email?</strong>
          <br />
          Check your spam folder or click <a onClick={() => onClick()}>
            here
          </a>{' '}
          to resend.
        </>
      )}

      {resendStatus === 'success' && <span className="success">Resent!</span>}
      {resendStatus === 'error' && (
        <span className="error">Resending failed</span>
      )}
    </p>
  )
}

export default ResendEmail
