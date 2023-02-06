// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongoConnection'
import { DB_NAME, USERS_COLLECTION } from '@/lib/constants'

type Payload = {
  modifiedCount: number
}

// mark user with the auth code as verified
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  const client = await clientPromise
  const usersCollection = client.db(DB_NAME).collection<User>(USERS_COLLECTION)

  const { authToken } = req.body
  console.log("authToken: " + authToken)
  
  const result = await usersCollection.updateOne({ authToken: authToken },
    {
      $set: {
        verified: true
      }
    })
    
  res.status(200).json({
    modifiedCount: result.modifiedCount
  })
  // const result = await usersCollection.updateOne(
  //   { authToken: authToken },
  //   {
  //     $set:
  //       { verified: true }
  //   })
  // console.log(result)
  // res.status(200).json(token)
  
}
