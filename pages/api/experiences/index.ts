import { EXPERIENCES_COLLECTION, DB_NAME } from '@/lib/constants'
import clientPromise from '@/lib/mongoConnection'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise
  const collection = client.db(DB_NAME).collection<Experience>(EXPERIENCES_COLLECTION)

  if (req.method === 'GET') {
    const results = await collection.find().toArray()
    const response = results.map(({ _id, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      }
    })
    res.status(200).json({ data: response })

  } else if (req.method === 'PUT') {
    const exp = req.body
    const result = await collection.updateOne({ _id: exp._id }, { $set: exp })
    res.status(200).json({ data: result })
    
  } else if (req.method === 'POST') {
    try {
      const body: Experience = req.body
      const { id, ...exp } = body // exclude id from body
      // console.log('exp to be added', exp)
      
      const result = await collection.insertOne(exp)
      // console.log('result', result)
      res.status(201).json({ data: result.insertedId.toString() })

    } catch (error) {
      console.error(error)
      res.status(500).json({ data: "Server unable to add new experience" })
    }
  }
    
}