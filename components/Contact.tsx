import { PopupButton } from "@typeform/embed-react"
import Button from '@mui/material/Button';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';

const Contact = () => {
  return (
    <div className='w-auto min-h-fit m-10 flex flex-col space-y-2 items-center justify-center'
      id="contact">
      <p>Interested in what I do?</p>
      <p>Let's get in contact!</p>
      <PopupButton className="rounded bg-blue-300 p-2"
        id="lXOZEfY0" style={{ fontSize: 20 }} >
        <EmailRoundedIcon /> Drop a message
      </PopupButton>
    </div>
  )
}

export default Contact