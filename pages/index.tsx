import type { NextPage } from 'next'
import Head from 'next/head'
import About from '../components/About'
import ProjectsCarousel from '@/components/ProjectsCarousel'
import Experiences from '../components/ExperiencesTimeline'
import Skills from '../components/Skills'
import Contact from '../components/Contact'

import clientPromise from "@/lib/mongoConnection"
import { GetStaticProps, GetStaticPaths } from 'next'
import { ABOUT_COLLECTION, CERTIFICATIONS_COLLECTION, DB_NAME, EXPERIENCES_COLLECTION, PLACEHOLDER_ABOUT, PLACEHOLDER_CERT, PLACEHOLDER_EXPERIENCE, PLACEHOLDER_PROJECT, PROJECTS_COLLECTION, USERS_COLLECTION } from "@/lib/constants"
import Link from "next/link"
import { useEffect } from "react"
import { CertificationsContainer } from '@/components/CertificationsContainer'

// export const getStaticPaths: GetStaticPaths = async () => {
  

//   // const registrationCodes = await usersCollection.find({}).map((user) => user.authToken).toArray()
//   // const paths = registrationCodes.map((code) => ({ params: { code } })) 

//   return {
//     paths: [],
//     fallback: false, // false to display my 404 page if `code` dynamic parameter is not found in `paths`
//   }
// }

// `getStaticPaths` requires using `getStaticProps`. `getStaticProps` is called at build time on server-side.
export const getStaticProps: GetStaticProps = async (context) => {
  const client = await clientPromise
  const aboutCollection = client.db(DB_NAME).collection<About>(ABOUT_COLLECTION)
  // Get about
  const aboutDb = await aboutCollection.findOne({})
  let about: About
  if (aboutDb === null) {
    about = PLACEHOLDER_ABOUT
  } else {
    const { _id, ...rest } = aboutDb
    about = { ...rest, id: _id.toString() }
  }

  // get projects
  const projectsCollection = client.db(DB_NAME).collection<Project>(PROJECTS_COLLECTION)
  const allProjectsDb = await projectsCollection.find().toArray()
  let projects: Project[] = []
  if (allProjectsDb.length > 0) {
    projects = allProjectsDb.map(({ _id, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  } else {
    projects.push(PLACEHOLDER_PROJECT)
  }
  
  // get experiences
  const expCollection = client.db(DB_NAME).collection<Experience>(EXPERIENCES_COLLECTION)
  const allExpDb = await expCollection.find().toArray()
  let experiences: Experience[] = []
  if (allExpDb.length > 0) {
    experiences = allExpDb.map(({ _id, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  } else {
    experiences.push(PLACEHOLDER_EXPERIENCE)
  }
  
  // get certifications
  const certCollection = client.db(DB_NAME).collection<Certification>(CERTIFICATIONS_COLLECTION)
  const allCertsDb = await certCollection.find().toArray()
  let certifications: Certification[] = []
  if (allCertsDb.length > 0) {
    certifications = allCertsDb.map(({ _id, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  } else {
    certifications.push(PLACEHOLDER_CERT)
  }

  return {
    // Passed to the ValidateRegistrationToken page component as props
    props: { about, projects, experiences, certifications },
  }
}

interface Props {
  about: About,
  projects: Project[],
  experiences: Experience[],
  certifications: Certification[],
}

const Home: NextPage<Props> = ({ about, projects, experiences, certifications }) => {
  return (
    <>
      <Head>
        <title>Thean Zhi Wei</title>
        <link rel="icon" href="/avatar.png" />
      </Head>

      <About {...about} />

      <ProjectsCarousel projects={projects} autoPlay />

      <Experiences experiences={experiences} />
      
      <CertificationsContainer certs={certifications} />
      <Contact />
    </>
  )
}

export default Home
