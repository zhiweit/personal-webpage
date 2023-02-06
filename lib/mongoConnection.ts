import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()
if (!process.env['MONGODB_URI']) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const client = new MongoClient(process.env['MONGODB_URI'])
const clientPromise: Promise<MongoClient> = client.connect()

export default clientPromise
