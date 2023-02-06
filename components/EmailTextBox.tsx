import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import EmailRounded from '@mui/icons-material/EmailRounded'
import { ChangeEvent, useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import { isValidEmail } from '@/lib/formValidation'

interface Props {
  required?: boolean
  width?: string
  height?: string
  updateEmail: (event: ChangeEvent<HTMLInputElement>) => void
}

const EmailTextBox = ({ required, width, height, updateEmail }: Props) => {

  const [email, setEmail] = useState('')

  return (
    <>
      <FormControl sx={{ m: 2, width: '25ch' }} variant="outlined" required={required}
        error={email != '' && !isValidEmail(email)}
      >
        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email"
          type='text'
          startAdornment={
            <InputAdornment position="start">
              <EmailRounded />
            </InputAdornment>
          }
          label="Email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value) // update local component state
            updateEmail(event) // update parent component state
          }}
        />
      </FormControl>
    </>
  )
}

export default EmailTextBox