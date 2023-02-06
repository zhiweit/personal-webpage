import type { NextApiRequest, NextApiResponse } from 'next'
import { writeFile, createWriteStream } from 'fs'
import {useRouter} from 'next/router'
import { verifyJwtCookie } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { jsonResponse } from '@/lib/utils'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest, res: NextResponse) {
  await verifyJwtCookie(req)
  return jsonResponse(200, {message: 'hi'})
  
  // s3.uploadFile()
  /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

  /* This is optional */
  // const newFileName = 'test-file'

  // s3
  //   .uploadFile(file, newFileName)
  //   .then(data => console.log(data))
  //   .catch(err => console.error(err))

  /**
   * {
   *   Response: {
   *     bucket: "myBucket",
   *     key: "image/test-image.jpg",
   *     location: "https://myBucket.s3.amazonaws.com/media/test-file.jpg"
   *   }
   * }
   */
}
