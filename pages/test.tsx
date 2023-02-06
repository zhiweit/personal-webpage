import { ChangeEvent, useEffect, useState } from 'react'
import { Autocomplete, Button, OutlinedInput, TextField } from '@mui/material'
import { GetServerSideProps } from 'next'
import clientPromise from '@/lib/mongoConnection'
import { DB_NAME, PROJECTS_COLLECTION } from '@/lib/constants'

import { WithId } from 'mongodb'
import Carousel from 'react-material-ui-carousel'
import Navbar from '@/components/Navbar'
import Toast, { ToastProps } from '@/components/Toast'


export default function handler() {
  return (
    <>
      <h1>test</h1>
      <Button onClick={async () => {
        await fetch('/api/test')
      }}>show</Button>

      
      
      
    </>
  )
}