import EmailTextBox from "@/components/EmailTextBox"
import PasswordTextBox from "@/components/PasswordTextBox"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { ChangeEvent, FormEvent, useState } from "react"
import { useRouter } from "next/router"

/*
  - on click of login,
  - Validate password
  - check if is verified
  - if not verified, tell user to check email, then end
  - Issue JWT token
  - set cookie
*/
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const payload = await loginResponse.json()
    if (loginResponse.status !== 200) {
      setErrorMsg(payload.message)
      return
    }
    
    // set cookies
    const cookiesResponse = await fetch('/api/cookies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    console.log('POST request to /api/cookies status', cookiesResponse.status)
    if (cookiesResponse.status !== 201) {
      setErrorMsg('Unable to set cookies')
      return
    }

    router.push('/')
    
  }

  return (
    <>
      <Box
        className=' h-screen flex flex-col place-items-center gap-6'
        component="form"
        autoComplete="on"
        onSubmit={handleLogin}
        >
        <h2 className='font-bold text-xl mt-4' >Login</h2>
        <EmailTextBox updateEmail={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} required />

        <PasswordTextBox label='Password' updatePassword={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)} required />
        {errorMsg !== '' ? <p className='text-sm mb-4 text-red-600 '>{errorMsg}</p> : null}
        <Button variant="contained" className='bg-blue-500' type='submit' >Login</Button>
      </Box>
    </>
  )
}