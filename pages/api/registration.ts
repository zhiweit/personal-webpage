import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongoConnection'
import BcryptHelper from '@/lib/bcryptHelper'
import EmailHelper from '@/lib/emailHelper'
import { DB_NAME, USERS_COLLECTION } from '@/lib/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }
  
  try {
    const client = await clientPromise
    const usersCollection = client.db(DB_NAME).collection(USERS_COLLECTION)

    let { email, password } = req.body
    const user = await usersCollection.findOne<User>({ email: email })
    if (user) {
      res.status(400).json({ message: 'Email already exists' })
      return
    }

    password = await BcryptHelper.hashPassword(password)

    const registrationCode = generateRegistrationCode()

    const newUser: User = {
      email: email,
      hashedPassword: password,
      role: 'USER',
      verified: false,
      authToken: registrationCode,
    }
    usersCollection.insertOne(newUser)
    // console.log('req.headers', req.headers)
    const basePath = req.headers.host
    // console.log(`${basePath}/register/${registrationCode}`)
    EmailHelper.sendRegistrationEmail(email, `${basePath}/register/${registrationCode}`)
    res.status(201).json({ message: 'Registration successful' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error in registering account' })
  }
}

function generateRegistrationCode(): string {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const n = characters.length
  let token = ''
  for (let i = 0; i < 40; i++) {
    token += characters[Math.floor(Math.random() * n)]
  }
  token += Date.now()
  return token
}