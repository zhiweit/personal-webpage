import Button from "@mui/material/Button"
import { useState } from "react"


const ImageUploader = ({ onUpload }: { onUpload: (imageUrl: string) => void }) => {

  const handleUpload = async (file: File) => {
    const requestObject = {
      method: 'POST',
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      })
    }
    const signedUrlRes = await fetch('/api/s3/upload', requestObject)
    const { signedUrl } = await signedUrlRes.json()
    // console.log(signedUrl)

    const res = await fetch(signedUrl, {
      method: 'PUT',
      body: file
    })
    // console.log('res', res)
    // console.log('image url returned from s3', res.url)
    const imageUrl = res.url.split("?")[0]
    // console.log('image url', imageUrl)
    onUpload(imageUrl)
  }

  return (
    <>
      <Button variant='contained' component='label' >
        Upload image
        <input hidden accept="image/*" type="file"
          onChange={async (e) => {
            if (!e.target.files) return
            handleUpload(e.target.files[0])
          }}
        />
        
      </Button>

    </>
  )
}
export default ImageUploader