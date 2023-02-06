import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { SyntheticEvent, useState } from 'react'

export interface ToastProps extends ToastMessage{
  onClose: (event: Event | SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => void
}

export default function Toast({ alertMessage, alertTitle, autoHideDurationMs, severity, onClose }: ToastProps) {
  const [open, setOpen] = useState(true)
  // console.log('alertMessage', alertMessage)
  return (

    <Snackbar
      open={open}
      autoHideDuration={autoHideDurationMs}
      onClose={(event: Event | SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
        // console.log('closing')
        setOpen(false)
        onClose(event, reason) // pass to parent component to update state that controls the display of this component
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity={severity}>
        <AlertTitle>{alertTitle}</AlertTitle>
        {alertMessage}
      </Alert>
    </Snackbar>

  )
}
