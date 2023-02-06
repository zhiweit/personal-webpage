import { ABOUT_COLLECTION, DB_NAME } from '@/lib/constants'
import clientPromise from '@/lib/mongoConnection'
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest,res: NextApiResponse) {
  const client = await clientPromise
  const aboutCollection = client.db(DB_NAME).collection<About>(ABOUT_COLLECTION)

  if (req.method === 'GET') {
    const aboutResults = await aboutCollection.findOne({})
    if (!aboutResults) return res.status(404).json({ data: 'Not found' })
    
    const { _id, ...data } = aboutResults
    const about: About = {
      id: _id.toString(),
      ...data
    }
    res.status(200).json({ data: about })

  } else if (req.method === 'PUT') {
    const { id, ...rest } = req.body as About
    const _id = new ObjectId(id)
    // console.log('req.body', req.body)
    const result = await aboutCollection.updateOne({ _id }, { $set: rest })
    // console.log(result)
    res.status(200).json({ data: result })

  } else if (req.method === 'POST') {
    const { id, ...rest } = req.body as About
    const result = await aboutCollection.insertOne(rest)
    res.status(200).json({ data: result })
  }
    
}