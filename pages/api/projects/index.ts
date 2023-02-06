import { PROJECTS_COLLECTION, DB_NAME } from '@/lib/constants'
import clientPromise from '@/lib/mongoConnection'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise
  const projectsCollection = client.db(DB_NAME).collection<Project>(PROJECTS_COLLECTION)

  if (req.method === 'GET') {
    const projectsResults = await projectsCollection.find().toArray()
    const response = projectsResults.map(({ _id, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      }
    })
    res.status(200).json({ data: response })

  } else if (req.method === 'PUT') {
    const project = req.body
    const result = await projectsCollection.updateOne({ _id: project._id }, { $set: project })
    res.status(200).json({ data: result })
    
  } else if (req.method === 'POST') {
    try {
      const body: Project = req.body
      const { id, ...project } = body // exclude id from body
      // console.log('project to be added', project)
      
      const result = await projectsCollection.insertOne(project)
      // console.log('result', result)
      res.status(201).json({ data: result.insertedId.toString() })

    } catch (error) {
      console.error(error)
      res.status(500).json({ data: "Server unable to add new project" })
    }
  }
    
}