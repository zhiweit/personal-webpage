import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

interface Props {
  showDialog: boolean
  alertTitle: string
  alertMessage: string
  onConfirm: (value: boolean) => void
  onClose: () => void
}

export default function AlertDialog({ showDialog, alertTitle, alertMessage, onConfirm, onClose }: Props) {
  const [open, setOpen] = useState(showDialog)

  const handleClose = () => {
    // console.log('closing')
    setOpen(false)
    onClose()
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {alertTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            handleClose()
            onConfirm(false)
          }} autoFocus>No</Button>

          <Button onClick={() => {
            handleClose()
            onConfirm(true)
          }}>Yes</Button>

        </DialogActions>
      </Dialog>
    </div>
  )
}