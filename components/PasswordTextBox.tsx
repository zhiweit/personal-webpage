import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import Tooltip from "@mui/material/Tooltip"
import { ChangeEvent, useState } from "react"
import { isStrongPassword } from '@/lib/formValidation'

interface Props {
  label: string
  required?: boolean
  width?: string
  height?: string
  updatePassword: (event: ChangeEvent<HTMLInputElement>) => void
}

const PasswordTextBox = ({ label, required, width, height, updatePassword }: Props) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined' required={required}
      error={password != '' && !isStrongPassword(password)}  >
      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
      <Tooltip title='Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.' placement='right-end'>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onMouseDown={() => setShowPassword((show) => !show)}
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={label}
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value) // update local state
            updatePassword(event) // update parent state
          }}
        />
      </Tooltip>
    </FormControl>

  )
}

export default PasswordTextBox