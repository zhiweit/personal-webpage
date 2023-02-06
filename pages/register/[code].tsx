import clientPromise from "@/lib/mongoConnection"
import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { DB_NAME, USERS_COLLECTION } from "@/lib/constants"
import Link from "next/link"
import { useEffect, useState } from "react"

// Pre-render pages for all the different registration codes for Static-Site Generation (SSG)
export const getStaticPaths: GetStaticPaths = async () => {
  const client = await clientPromise
  const usersCollection = client.db(DB_NAME).collection<User>(USERS_COLLECTION)

  const registrationCodes = await usersCollection.find({}).map((user) => user.authToken).toArray()
  const paths = registrationCodes.map((code) => ({ params: { code } })) 

  return {
    paths: paths,
    fallback: false, // false to display my 404 page if `code` dynamic parameter is not found in `paths`
  }
}

// `getStaticPaths` requires using `getStaticProps`. `getStaticProps` is called at build time on server-side.
export const getStaticProps: GetStaticProps = (context) => {
  const registrationCode = context.params?.code as string // code will exist since paths for the valid codes were generated from users collection

  return {
    // Passed to the ValidateRegistrationToken page component as props
    props: { registrationCode: registrationCode },
  }
}

interface Props {
  registrationCode: string
}
const ValidateRegistrationToken: NextPage<Props> = ({ registrationCode }) => {
  const [registrationObj, setRegistrationObj] = useState({ verified: false, message: '' })

  useEffect(() => {
    completeRegistration()
  }, [])

  const completeRegistration = async () => {
    try {
      // call server api to update user as verified
      const res = await fetch('/api/completeRegistration', { // must give absolute url for SSG
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authToken: registrationCode
        }),
      })

      if (res.status === 200) {
        const { modifiedCount } = await res.json()
        setRegistrationObj({ verified: true, message: 'Registration completed successfully' })
        // console.log('modifiedCount', modifiedCount)
        // if (modifiedCount === 1) {
        // } else {
        //   setRegistrationObj({ verified: false, message: 'Registration was unsuccessful' })
        // }
      }
    } catch (error: any) {
      console.error("Error occurred when completing registration: ", error)
      setRegistrationObj({ verified: false, message: error.message })
    }

  }

  return (
    <div className='w-auto text-center'>
      <p className='font-medium'>
        {registrationObj.message}
      </p>
      {registrationObj.verified ?
        <p>Click <Link href={'/login'}>here</Link> to login</p> :
        null}
      
    </div>
  )

}
export default ValidateRegistrationToken