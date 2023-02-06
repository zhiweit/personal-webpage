import { useState, ChangeEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import PasswordTextBox from '@/components/PasswordTextBox'
import { isValidEmail, isStrongPassword } from '@/lib/formValidation'
import EmailTextBox from '@/components/EmailTextBox'
import { PLACEHOLDER_TOAST_MESSAGE } from '@/lib/constants'
import Toast from '@/components/Toast'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alertMsg, setAlertMsg] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [toastMessage, setToastMessage] = useState(PLACEHOLDER_TOAST_MESSAGE)
  return (
    <Box
      component="form"
      autoComplete="on"
      className=' h-screen flex flex-col place-items-center gap-6'
      onSubmit={async (event) => {
        event.preventDefault()
        if (!isValidEmail(email)) {
          setAlertMsg('Email is not valid.')
          return
        }

        if (password !== confirmPassword) {
          setAlertMsg('Passwords must match.')
          return
        }

        if (!isStrongPassword(password)) {
          setAlertMsg('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
          return
        }

        // send email, password to server to save new user into db, verification email
        const res = await fetch('/api/registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email, password
          }),
        })
        const { message } = await res.json()
        setAlertMsg(message)
        if (res.status === 201) {
          setToastMessage({
            alertMessage: 'Registration successful! Please check your email to verify your account.',
            alertTitle: 'Success',
            severity: 'success',
            autoHideDurationMs: 3000,
          })
        } else {
          setToastMessage({
            alertMessage: message,
            alertTitle: 'Error',
            severity: 'error',
            autoHideDurationMs: 3000,
          })
        }
      }}
    >
      {toastMessage.alertMessage !== '' ?
        <Toast {...toastMessage} onClose={(event, reason) => setToastMessage(PLACEHOLDER_TOAST_MESSAGE)} />
        : null}
      <h2 className='font-bold text-xl mt-4' >Register</h2>
      {/* Email */}
      <EmailTextBox updateEmail={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} required />

      {/* Password */}
      <PasswordTextBox label='Password' updatePassword={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)} required />

      {/* Confirm password */}
      <PasswordTextBox label='Confirm password' updatePassword={(event: ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)} required />

      <p className='text-sm mb-4 text-red-600 '>{alertMsg}</p>
      <Button variant="contained" className='bg-blue-500' type='submit' >Register</Button>
    </Box>
  )
}

