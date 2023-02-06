import type { NextApiRequest, NextApiResponse } from 'next'
import BcryptHelper from '@/lib/bcryptHelper'
import clientPromise from '@/lib/mongoConnection'
import { DB_NAME, USERS_COLLECTION } from '@/lib/constants'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * Validates if user exists, email and password is correct, and if user is verified
   * If correct, returns user role
   */
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const client = await clientPromise
    const usersCollection = client.db(DB_NAME).collection(USERS_COLLECTION)

    let { email, password } = req.body
    const user = await usersCollection.findOne<User>({ email: email })

    if (!user)
      return res.status(400).json({ message: 'Email does not exist' })

    const passwordMatch = await BcryptHelper.verifyPassword(password, user.hashedPassword)
    if (!passwordMatch)
      return res.status(400).json({ message: 'Password is incorrect' })
    
    if (!user.verified)
      return res.status(400).json({ message: 'Please verify your email' })

    res.status(200).json({ role: user.role })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error in verifying login details' })
  }
  
}