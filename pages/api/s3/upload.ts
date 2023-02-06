import { NextApiRequest, NextApiResponse } from "next"
// import S3 from 'aws-sdk/clients/s3'

// const config = {
//   region: process.env.AWS_DEFAULT_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   signatrueVersion: 'v4',
// }
// const s3 = new S3(config)

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   try {
//     console.log(req.body, typeof(req.body))
//     const { fileName, fileType } = JSON.parse(req.body)
//     console.log('fileName', fileName, 'fileType', fileType)

//     const fileParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: fileName,
//       Expires: 600,
//       ContentType: fileType,
//       ACL: 'public-read',
//     }

//     const signedUrl = await s3.getSignedUrlPromise('putObject', fileParams)
//     res.status(200).json({ signedUrl })

//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: 'Server unable to upload file to S3' })
//   }
// }

import AWS from 'aws-sdk'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  })

  const S3_BUCKET = process.env.AWS_BUCKET_NAME
  const REGION = process.env.AWS_DEFAULT_REGION
  const URL_EXPIRATION_TIME = 600; // in seconds

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  })

  const { fileName, fileType } = JSON.parse(req.body)
  // console.log('fileName', fileName, 'fileType', fileType)

  if (req.method === 'POST') {
    const signedUrl = myBucket.getSignedUrl('putObject', {
      Key: fileName,
      ContentType: fileType,
      Expires: URL_EXPIRATION_TIME
    })
    res.status(200).json({ signedUrl })
    

  } else if (req.method === 'GET') {
    const signedUrl = myBucket.getSignedUrl('getObject', {
      Key: fileName,
      // ContentType: fileType,
      Expires: URL_EXPIRATION_TIME
    })
    // console.log('signedUrl', signedUrl)
    const imageUrl = signedUrl.split("?")[0]
    // console.log('imageUrl', imageUrl)
    res.status(200).json({ imageUrl })
  }

}