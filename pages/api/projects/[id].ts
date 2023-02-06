import { PROJECTS_COLLECTION, DB_NAME } from '@/lib/constants'
import clientPromise from '@/lib/mongoConnection'
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise
  const projectsCollection = client.db(DB_NAME).collection<Project>(PROJECTS_COLLECTION)

  const _id = new ObjectId(req.query.id as string) // transform the string id into a MongoDB ObjectId

  if (req.method === 'GET') {
    try {
      const result = await projectsCollection.findOne({ _id: _id })
      if (result === null) {
        res.status(404).json({ data: 'Not found' })
        return
      }

      const project: Project = { ...result, id: result._id.toString() }
      res.status(200).json({ data: project })

    } catch (error) {
      res.status(500).json({ data: error })
    }

  } else if (req.method === 'PUT') {
    try {
      const { id, ...project } = req.body // exclude id from body
      // console.log('project', project)
      const result = await projectsCollection.updateOne({ _id: _id }, { $set: project })
      // console.log('result', result)
      res.status(200).json({ data: result })
      
    } catch (error) {
      res.status(500).json({ data: error })
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await projectsCollection.deleteOne({ _id: _id })
      
      res.status(200).json({ data: result })
      
    } catch (error) {
      res.status(500).json({ data: error })
    }
  }

}